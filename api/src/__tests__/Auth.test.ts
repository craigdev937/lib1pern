import request from "supertest";
import { afterEach, describe, expect, it, rs } from "@rstest/core";
import jwt from "jsonwebtoken";
import { APP } from "../App.js";
import { dBase } from "../data/Data.js";

afterEach(() => { rs.restoreAllMocks(); });

describe("Public authentication", () => {
    it("returns an error status when login cannot reach the database", async () => {
        rs.spyOn(dBase, "query").mockRejectedValueOnce(new Error("Database unavailable") as never);
        const response = await request(APP).post("/api/users/login")
            .send({ email: "ada@example.com", password: "secret123" });
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
    });

    it("reports duplicate registration without creating another user", async () => {
        const query = rs.spyOn(dBase, "query").mockResolvedValueOnce({ rows: [{ email: "ada@example.com" }] } as never);
        const response = await request(APP).post("/api/users/register").send({
            first: "Ada", last: "Lovelace", email: "ada@example.com", password: "secret123", type: "PATRON",
        });
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe("User already exists!");
        expect(query.mock.calls.length).toBe(1);
    });
    it("permits credentialed requests from the frontend", async () => {
        const response = await request(APP).options("/api/users/login")
            .set("Origin", "http://localhost:6173")
            .set("Access-Control-Request-Method", "POST");
        expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:6173");
        expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });

    it("does not grant CORS access to an unrelated origin", async () => {
        const response = await request(APP).options("/api/users/login")
            .set("Origin", "https://unrelated.example");
        expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("registers only patrons even when the caller requests ADMIN", async () => {
        const row = { id: 7, first: "Ada", last: "Lovelace", email: "ada@example.com", type: "PATRON", password: "hashed-password" };
        const query = rs.spyOn(dBase, "query");
        query.mockResolvedValueOnce({ rows: [] } as never);
        query.mockResolvedValueOnce({ rows: [row] } as never);
        rs.spyOn(jwt, "sign").mockImplementation(() => "test-token");
        const response = await request(APP).post("/api/users/register").send({
            first: "Ada", last: "Lovelace", email: row.email, password: "secret123", type: "ADMIN",
        });
        expect(response.status).toBe(201);
        expect(query.mock.calls[1][1]).toEqual(["Ada", "Lovelace", "PATRON", row.email, expect.any(String)]);
        expect(response.body.data.user.password).toBeUndefined();
        expect(response.headers["set-cookie"]).toBeTruthy();
    });
});
