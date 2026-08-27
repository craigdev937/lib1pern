import express from "express";
import { AUTH } from "../controllers/AuthCTR.js";
import { VAL } from "../middleware/Validate.js";
import { PRO } from "../middleware/Auth.js";
import { USchema, LSchema } from "../validation/Zod.js";

// Routes:  localhost:9000/api/users
export const authRt: express.Router = express.Router();
    authRt.post("/users/register", VAL(USchema), AUTH.Register);
    authRt.post("/users/login", VAL(LSchema), AUTH.Login);
    authRt.post("/users/logout", AUTH.Logout);
    authRt.get("/users/profile", PRO, AUTH.Profile);



    