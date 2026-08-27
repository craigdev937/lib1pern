import express from "express";
import jwt from "jsonwebtoken";
import { dBase } from "../data/Data.js";
import type { IData, JwtPayload } from "../models/Interfaces.js";
const JWT = process.env.JWT_SECRET ?? "";

export const PRO: express.Handler = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ msg: "Not Authorized, no token" });
    };

    try {
        const decoded = jwt.verify(token, JWT) as JwtPayload;
        const QRY = "SELECT * FROM users WHERE id=$1";
        const user = await dBase.query<IData>(QRY, [decoded.id]);
        req.user = user.rows[0];
        next();
    } catch (error) {
        return res
            .status(401)
            .json({
                success: false,
                msg: "Invalid Token",
                error: error instanceof Error ?
                    error.message: "Unknown Error!"
            });
    }
};

export const signToken = (payload: JwtPayload) => {
    return jwt.sign(
        payload, JWT, { expiresIn: "1h" }
    );
};




