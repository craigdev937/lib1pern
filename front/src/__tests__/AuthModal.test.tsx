import { afterEach, beforeEach, describe, expect, it, rs } from "@rstest/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { Navbar } from "../routes/Navbar";
import { AuthAPI } from "../global/AuthAPI";
import { ThemeReducer } from "../global/ThemeSlice";

const user = { id: 7, first: "Ada", last: "Lovelace", email: "ada@example.com", type: "PATRON", created_at: "", updated_at: "" };
let authenticated = false;
let rejectLogin = false;
let rejectProfile = false;
let submitted: { path: string; body: unknown; credentials: string }[] = [];

function CurrentPage() {
    return <h1>Current page: {useLocation().pathname}</h1>;
}

function renderNavbar() {
    const store = configureStore({
        reducer: { theme: ThemeReducer, [AuthAPI.reducerPath]: AuthAPI.reducer },
        middleware: (getDefault) => getDefault().concat(AuthAPI.middleware),
    });
    render(<Provider store={store}><MemoryRouter initialEntries={["/catalog"]}>
        <Routes><Route element={<Navbar />}><Route path="/catalog" element={<CurrentPage />} /></Route></Routes>
    </MemoryRouter></Provider>);
    return store;
}

beforeEach(() => {
    authenticated = false;
    rejectLogin = false;
    rejectProfile = false;
    submitted = [];
    const modal = document.createElement("aside");
    modal.id = "modal";
    document.body.append(modal);
    // jsdom does not implement native dialog interaction; browser QA covers it.
    HTMLDialogElement.prototype.showModal = function () { this.open = true; };
    HTMLDialogElement.prototype.close = function () {
        this.open = false;
        this.dispatchEvent(new Event("close"));
    };
    rs.stubGlobal("fetch", async (input: Request) => {
        const path = new URL(input.url).pathname;
        if (input.method === "POST") {
            submitted.push({ path, body: await input.json(), credentials: input.credentials });
            if (rejectLogin) return Response.json({ msg: "Invalid Credentials!" }, { status: 401 });
            authenticated = true;
            return Response.json(path.endsWith("register")
                ? { success: true, message: "Registered", data: { user, token: "test" } }
                : { success: true, message: "Logged in", data: { id: 7, email: user.email }, token: "test" });
        }
        if (authenticated && rejectProfile) return Response.json({ message: "Profile unavailable" }, { status: 500 });
        return authenticated
            ? Response.json({ success: true, message: "Profile", data: user })
            : Response.json({ msg: "Not Authorized, no token" }, { status: 401 });
    });
});

afterEach(() => {
    cleanup();
    document.getElementById("modal")?.remove();
    rs.unstubAllGlobals();
});

describe("Navbar authentication modal", () => {
    it("opens and closes without replacing the current page", async () => {
        renderNavbar();
        fireEvent.click(await screen.findByRole("button", { name: "Login" }));
        expect(screen.getByRole("dialog")).toBeTruthy();
        expect(screen.getByText("Current page: /catalog")).toBeTruthy();
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(screen.getByText("Current page: /catalog")).toBeTruthy();
    });

    it("logs in with cookies and updates the Navbar", async () => {
        renderNavbar();
        fireEvent.click(await screen.findByRole("button", { name: "Login" }));
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: user.email } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));
        await screen.findByRole("link", { name: "My profile" });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(submitted).toEqual([{ path: "/api/users/login", body: { email: user.email, password: "secret123" }, credentials: "include" }]);
    });

    it("keeps the form open and explains a rejected login", async () => {
        rejectLogin = true;
        renderNavbar();
        fireEvent.click(await screen.findByRole("button", { name: "Login" }));
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: user.email } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));
        expect((await screen.findByRole("alert")).textContent).toContain("Invalid Credentials");
        expect(screen.getByRole("dialog")).toBeTruthy();
    });

    it("checks confirmation before registering a patron and signing them in", async () => {
        renderNavbar();
        fireEvent.click(await screen.findByRole("button", { name: "Login" }));
        fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
        for (const [label, value] of Object.entries({ "First name": "Ada", "Last name": "Lovelace", Email: user.email, Password: "secret123", "Confirm password": "different" })) {
            fireEvent.change(screen.getByLabelText(label), { target: { value } });
        }
        fireEvent.click(screen.getByRole("button", { name: "Register" }));
        expect((await screen.findByRole("alert")).textContent).toContain("Passwords do not match");
        expect(submitted.length).toBe(0);
        fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: "secret123" } });
        fireEvent.click(screen.getByRole("button", { name: "Register" }));
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
        expect(await screen.findByRole("link", { name: "My profile" })).toBeTruthy();
        expect(submitted).toEqual([{ path: "/api/users/register", body: { first: "Ada", last: "Lovelace", email: user.email, password: "secret123", type: "PATRON" }, credentials: "include" }]);
    });

    it("restores an existing session when the Navbar mounts", async () => {
        authenticated = true;
        renderNavbar();
        expect(await screen.findByRole("link", { name: "My profile" })).toBeTruthy();
        expect(screen.queryByRole("button", { name: "Login" })).toBeNull();
    });

    it("offers login again when the saved session expires", async () => {
        authenticated = true;
        const store = renderNavbar();
        await screen.findByRole("link", { name: "My profile" });
        authenticated = false;
        store.dispatch(AuthAPI.util.invalidateTags([{ type: "Auth", id: "SESSION" }]));
        expect(await screen.findByRole("button", { name: "Login" })).toBeTruthy();
        expect(screen.queryByRole("link", { name: "My profile" })).toBeNull();
    });

    it("retries profile loading without submitting credentials again", async () => {
        rejectProfile = true;
        renderNavbar();
        fireEvent.click(await screen.findByRole("button", { name: "Login" }));
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: user.email } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
        fireEvent.click(screen.getByRole("button", { name: "Log in" }));
        await screen.findByRole("alert");
        rejectProfile = false;
        fireEvent.click(screen.getByRole("button", { name: "Retry profile" }));
        await screen.findByRole("link", { name: "My profile" });
        expect(submitted.length).toBe(1);
        expect(screen.queryByRole("dialog")).toBeNull();
    });
});
