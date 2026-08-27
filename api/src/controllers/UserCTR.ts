import express from "express";
import { dBase } from "../data/Data.js";
import type { IData } from "../models/Interfaces.js";

class UserClass {
    FetchAll: express.Handler = async (req, res, next) => {
        try {
            const QRY = "SELECT * FROM users ORDER BY id ASC";
            const users = await dBase.query<IData[]>(QRY);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "All Registered Users!",
                    count: users.rows.length,
                    data: users.rows
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error fetching all the Users!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };
};

export const USER: UserClass = new UserClass();


