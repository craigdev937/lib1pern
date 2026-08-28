import express from "express";
import { USER } from "../controllers/UserCTR.js";
import { VAL } from "../middleware/Validate.js";
import { USchema } from "../validation/Zod.js";

// Routes:  localhost:9000/api/users
export const userRt: express.Router = express.Router();
    userRt.get("/users", USER.FetchAll);
    userRt.get("/users/:id", USER.GetOne);
    userRt.put("/users/:id", VAL(USchema), USER.Update);
    userRt.delete("/users/:id", USER.Delete);


