import express from "express";
import { USER } from "../controllers/UserCTR.js";

// Routes:  localhost:9000/api/users
export const userRt: express.Router = express.Router();
    userRt.get("/users", USER.FetchAll);


