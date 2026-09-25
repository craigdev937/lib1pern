import React from "react";
import ReactDOM from "react-dom";
import styles from "./Login.module.css";
import { AuthAPI } from "../../global/AuthAPI";
import { LSchema, USchema } from "../../validation/Schema";

type LOG = {
    onClose: () => void;
};

function errorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null && "data" in error) {
        const data = error.data;
        if (typeof data === "object" && data !== null) {
            if ("msg" in data && typeof data.msg === "string") return data.msg;
            if ("message" in data && typeof data.message === "string") return data.message;
            if ("errors" in data && Array.isArray(data.errors)) {
                return data.errors.map((item) => item.message).join(" ");
            }
        }
    }
    return "Unable to connect. Please try again.";
}

export const Login = ({ onClose }: LOG) => {
    const [mode, setMode] = React.useState<"login" | "register">("login");
    const [error, setError] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [sessionCreated, setSessionCreated] = React.useState(false);
    const dialog = React.useRef<HTMLDialogElement>(null);
    const inFlight = React.useRef(false);
    const mounted = React.useRef(false);
    const [log] = AuthAPI.useLogMutation();
    const [reg] = AuthAPI.useRegMutation();
    const [loadProfile] = AuthAPI.useLazyProfileQuery();
    const registering = mode === "register";

    React.useEffect(() => {
        mounted.current = true;
        if (!dialog.current?.open) dialog.current?.showModal();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            mounted.current = false;
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (inFlight.current) return;
        setError("");
        const values = Object.fromEntries(new FormData(event.currentTarget));
        inFlight.current = true;
        setSubmitting(true);
        let signedIn = sessionCreated;
        try {
            if (!signedIn) {
                if (registering && values.password !== values.confirmPassword) {
                    setError("Passwords do not match.");
                    return;
                }
                const parsed = registering
                    ? USchema.safeParse({ ...values, type: "PATRON" })
                    : LSchema.safeParse(values);
                if (!parsed.success) {
                    setError(parsed.error.issues.map((issue) => `${issue.path.join(" ")}: ${issue.message}`).join(" "));
                    return;
                }
                if (registering) await reg(USchema.parse(parsed.data)).unwrap();
                else await log(parsed.data).unwrap();
                signedIn = true;
                if (mounted.current) setSessionCreated(true);
            }
            await loadProfile().unwrap();
            if (mounted.current) onClose();
        } catch (cause) {
            if (mounted.current) setError(signedIn
                ? "You are signed in, but your profile could not be loaded. Please retry."
                : errorMessage(cause));
        } finally {
            inFlight.current = false;
            if (mounted.current) setSubmitting(false);
        }
    }

    const modalRoot = document.getElementById("modal");
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <dialog ref={dialog} className={styles.login} aria-labelledby="auth-title"
            onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={onClose}>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">×</button>
            <h1 id="auth-title">{registering ? "Create your account" : "Welcome back"}</h1>
            <p>{registering ? "Register to get started with your library." : "Log in to your library account."}</p>
            <form key={mode} onSubmit={submit} aria-busy={submitting}>
                <fieldset disabled={submitting || sessionCreated} className={styles.fields}>
                    {registering && <>
                        <label htmlFor="auth-first">First name</label>
                        <input id="auth-first" name="first" autoComplete="given-name" required minLength={2} maxLength={120} />
                        <label htmlFor="auth-last">Last name</label>
                        <input id="auth-last" name="last" autoComplete="family-name" required minLength={2} maxLength={120} />
                    </>}
                    <label htmlFor="auth-email">Email</label>
                    <input id="auth-email" name="email" type="email" autoComplete="email" required />
                    <label htmlFor="auth-password">Password</label>
                    <input id="auth-password" name="password" type="password"
                        autoComplete={registering ? "new-password" : "current-password"} required minLength={6} />
                    {registering && <>
                        <label htmlFor="auth-confirm">Confirm password</label>
                        <input id="auth-confirm" name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} />
                    </>}
                </fieldset>
                {error && <p role="alert" className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? "Please wait…" : sessionCreated ? "Retry profile" : registering ? "Register" : "Log in"}
                </button>
                {submitting && <p role="status">Signing you in…</p>}
            </form>
            <button type="button" className={styles.switchMode} disabled={submitting || sessionCreated}
                onClick={() => { setMode(registering ? "login" : "register"); setError(""); }}>
                {registering ? "Already have an account? Log in" : "Create an account"}
            </button>
        </dialog>, modalRoot
    );
};
