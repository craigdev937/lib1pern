import express from "express";
import { ZodObject, ZodError } from "zod";

export const VAL = (schema: ZodObject): express.Handler => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync(req.body);
            req.body = parsed;
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: "Fail!",
                    errors: error.issues.map((err) => ({
                        path: err.path,
                        message: err.message
                    })),
                })
            }
            return next(error);
        }
    };
};



