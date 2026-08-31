import express from "express";
import { dBase } from "../data/Data.js";
import { BSchema } from "../validation/Zod.js";
import type { BType } from "../validation/Zod.js";
import type { IBook } from "../models/Interfaces.js";

class BookClass {
    Create: express.Handler = async (req, res, next) => {
        try {
            const B = BSchema.parse(req.body);
            const QRY = `INSERT INTO books 
            (barcode, cover_url, title, authors, 
            description, subjects, publication_date, 
            publisher, pages, genre) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *`;
            const values = [B.barcode, B.cover_url, B.title, 
                B.authors, B.description, B.subjects, 
                B.publication_date, B.publisher, B.pages, B.genre];
            const newBook = await dBase.query<BType>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The Book was Created!",
                    data: newBook.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error creating a new book.",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };

    FetchAll: express.Handler = async (req, res, next) => {
        try {
            const QRY = "SELECT * FROM books ORDER BY id ASC";
            const allBooks = await dBase.query<IBook[]>(QRY);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "All Books!",
                    data: allBooks.rows
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error fetching all books.",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };

    GetOne: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "SELECT * FROM books WHERE id = $1";
            const values = [id];
            const allBooks = await dBase.query<IBook>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "One Book!",
                    data: allBooks.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Failed getting one book!",
                    error: error instanceof Error ?
                        error.message : "Unknown Error!"
                });
            return next(error);
        }
    };

    Update: express.Handler = async (req, res, next) => {
        try {
            const B = BSchema.parse(req.body);
            const { id } = req.params;
            const QRY = `UPDATE books 
            SET barcode=$1, cover_url=$2, title=$3, 
            authors=$4, description=$5, subjects=$6, 
            publication_date=$7, publisher=$8, pages=$9, 
            genre=$10, updated_at=CURRENT_TIMESTAMP 
            WHERE id=$11 RETURNING *`;
            const values = [B.barcode, B.cover_url, B.title, 
                B.authors, B.description, B.subjects, 
                B.publication_date, B.publisher, B.pages, B.genre, id];
            const upBook = await dBase.query<IBook>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The Book was Updated!",
                    data: upBook.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error updating the Book",
                    error: error instanceof Error ?
                        error.message : "Unknown Error1"
                });
            return next(error);
        }
    };

    Delete: express.Handler = async (req, res, next) => {
        try {
            const { id } = req.params;
            const QRY = "DELETE FROM books WHERE id = $1";
            const values = [id];
            const deleteBook = await dBase.query<IBook>(QRY, values);
            return res
                .status(201)
                .json({
                    success: true,
                    message: "The Book was Deleted!",
                    data: deleteBook.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false,
                    message: "Error deleting the Book",
                    error: error instanceof Error ?
                        error.message : "Unknown Error1"
                });
            return next(error);
        }
    };
};

export const BOOK: BookClass = new BookClass();





