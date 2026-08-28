import express from "express";
import { dBase } from "../data/Data.js";
import type { IData } from "../models/Interfaces.js";
import { USchema } from "../validation/Zod.js";

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

    GetOne: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "SELECT * FROM users WHERE id=$1";
            const oneUser = await dBase.query<IData>(QRY, [id]);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "User",
                    data: oneUser.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error getting one user!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };

    Update: express.Handler = async (req, res, next) => {
        try {
            const U = USchema.parse(req.body);
            const { id } = req.params;
            const QRY = `UPDATE users
            SET first=$1, last=$2, email=$3, password=$4, 
            type=$5, updated_at = CURRENT_TIMESTAMP 
            WHERE id=$6 RETURNING *`;
            const values = [U.first, U.last, U.email, 
                U.password, U.type, id];
            const user = await dBase.query<IData>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The User was Updated!",
                    data: user.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error Updating the User!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };
};

export const USER: UserClass = new UserClass();


