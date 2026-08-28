import express from "express";
import bcrypt from "bcryptjs";
import { dBase } from "../data/Data.js";
import { LSchema, USchema } from "../validation/Zod.js";
import { signToken } from "../middleware/Auth.js";
import type { IData, IUser } from "../models/Interfaces.js";

class AuthClass {
    Register: express.Handler = async (req, res, next) => {
        try {
            const R = USchema.parse(req.body);
            const eQRY = `SELECT email FROM users WHERE email=$1`;
            const userExists = await dBase.query<IData>(eQRY, [R.email]);
            if (userExists.rows.length > 0) {
                return res.status(401)
                    .json({ msg: "User already exists!" });
            };
            const bPass = await bcrypt.hash(R.password, 10);
            const QRY = `INSERT INTO users 
            (first, last, type, email, password) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
            const values = [R.first, R.last, R.type, R.email, bPass];
            const newUser = await dBase.query<IData>(QRY, values);
            const newToken = signToken(newUser.rows[0]);
            res.cookie("token", newToken, {
                httpOnly: true,
                secure: false,  // change to true for production.
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 //  1-Hour
            });
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The User has Registered!",
                    data: {
                        user: newUser.rows[0],
                        token: newToken
                    }
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error Registering a new user!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };

    Login: express.Handler = async (req, res, next) => {
        try {
            const L = LSchema.parse(req.body);
            const fQRY = "SELECT * FROM users WHERE email=$1";
            const user = await dBase.query<IUser>(fQRY, [L.email]);
            if (user.rows.length === 0) {
                return res
                    .status(401)
                    .json({ msg: "Invalid Credentials!" });
            };
            const uData = user.rows[0];
            const isMatch = await bcrypt.compare(
                L.password,
                uData.password
            );
            if (!isMatch) {
                return res.status(401)
                    .json({ msg: "Invalid Credentials!" });
            };
            const logToken = signToken(uData);
            res.cookie("token", logToken, {
                httpOnly: true,
                secure: false,  // Is true for Production!
                sameSite: "strict",
                maxAge: 1000 * 60 * 60  // 1-Hour.
            });
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The User has Logged In!",
                    data: {
                        id: uData.id,
                        email: uData.email
                    },
                    token: logToken
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error loggin in the user!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };

    Logout: express.Handler = async (req, res, next) => {
        try {
            res.cookie("token", "", {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 1
            });
            res
                .status(201)
                .json({
                    success: true,
                    message: "The User has Logged Out!"
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error logging out the user!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            next(error);
        }
    };

    Profile: express.Handler = async (req, res, next) => {
        try {
            const { id, type, first, last, email, 
                created_at, updated_at } = req.user as IData;
            res.json({
                success: true,
                message: "The User Profile!",
                data: { 
                    id, type, first, last, 
                    email, created_at, updated_at
                }
            });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error retreiving User Profile!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            next(error);
        }
    };
};

export const AUTH: AuthClass = new AuthClass();



