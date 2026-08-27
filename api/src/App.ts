import "dotenv/config";
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { ERR } from "./middleware/midError.js";
import { authRt } from "./routes/AuthRT.js";
import { userRt } from "./routes/UserRT.js";

export const APP: express.Application = express();
APP.use(helmet());

// CORS Setup //
APP.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods",
            "POST, GET, PUT, PATCH, DELETE");
        return res
            .status(res.statusCode)
            .json({ "status message": "OK" });
    };
    next();
});

APP.use(express.urlencoded({ extended: true }));
APP.use(express.json());
APP.use(cookieParser());
APP.use(logger("dev"));
APP.use("/api", authRt);
APP.use("/api", userRt);
APP.use(ERR.notFound);
APP.use(ERR.errHandler);



