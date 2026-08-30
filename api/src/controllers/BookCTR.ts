import express from "express";
import type { PoolClient } from "pg";
import { dBase } from "../data/Data.js";
import { BCreateSchema } from "../validation/Zod.js";
import type { BCreateType } from "../validation/Zod.js";
import type { IBook } from "../models/Interfaces.js";

const BOOK_SELECT = `
    SELECT b.*,
        COALESCE(array_agg(DISTINCT a.name) FILTER (WHERE a.id IS NOT NULL), ARRAY[]::TEXT[]) AS authors,
        COALESCE(array_agg(DISTINCT s.name) FILTER (WHERE s.id IS NOT NULL), ARRAY[]::TEXT[]) AS subjects
    FROM books b
    LEFT JOIN book_authors ba ON ba.book_id = b.id
    LEFT JOIN authors a ON a.id = ba.author_id
    LEFT JOIN book_subjects bs ON bs.book_id = b.id
    LEFT JOIN subjects s ON s.id = bs.subject_id
`;

type DatabaseClient = Pick<PoolClient, "query">;

class BookClass {
    private async saveRelationships(client: PoolClient, bookId: number, book: BCreateType): Promise<void> {
        await client.query("DELETE FROM book_authors WHERE book_id=$1", [bookId]);
        await client.query("DELETE FROM book_subjects WHERE book_id=$1", [bookId]);

        for (const name of book.authors) {
            const author = await client.query<{ id: number }>(
                `INSERT INTO authors (name) 
                VALUES ($1)
                ON CONFLICT (name) 
                DO UPDATE SET name=EXCLUDED.name 
                RETURNING id`, [name]
            );
            await client.query(
                `INSERT INTO book_authors 
                (book_id, author_id) 
                VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [bookId, author.rows[0].id]
            );
        }

        for (const name of book.subjects) {
            const subject = await client.query<{ id: number }>(
                `INSERT INTO subjects (name) VALUES ($1)
                ON CONFLICT (name) 
                DO UPDATE SET name=EXCLUDED.name 
                RETURNING id`, [name]
            );
            await client.query(
                `INSERT INTO book_subjects 
                (book_id, subject_id) 
                VALUES ($1, $2) 
                ON CONFLICT DO NOTHING`,
                [bookId, subject.rows[0].id]
            );
        }
    }

    private async findById(client: DatabaseClient, id: string | number): Promise<IBook | undefined> {
        const result = await client.query<IBook>(`${BOOK_SELECT} WHERE b.id=$1 GROUP BY b.id`, [id]);
        return result.rows[0];
    }

    Create: express.Handler = async (req, res, next) => {
        const client = await dBase.connect();
        try {
            const B = BCreateSchema.parse(req.body);
            await client.query("BEGIN");
            const created = await client.query<{ id: number }>(
                `INSERT INTO books (barcode, cover_url, title, 
                description, publication_date, publisher, pages, genre)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [B.barcode, B.cover_url, B.title, B.description, 
                    B.publication_date, B.publisher, B.pages, B.genre]
            );
            const bookId = created.rows[0].id;
            await this.saveRelationships(client, bookId, B);
            const newBook = await this.findById(client, bookId);
            await client.query("COMMIT");
            return res
                    .status(201)
                    .json({
                        success: true, 
                        message: "The Book was Created!", 
                        data: newBook
                    });
        } catch (error) {
            await client.query("ROLLBACK");
            res
                .status(res.statusCode)
                .json({
                    success: false, 
                    message: "Error Creating the Book!",
                    error: error instanceof Error ? 
                    error.message : "Unknown Error!"
                });
            return next(error);
        } finally {
            client.release();
        }
    };

    FetchAll: express.Handler = async (req, res, next) => {
        try {
            const books = await dBase.query<IBook>(`${BOOK_SELECT} GROUP BY b.id ORDER BY b.id ASC`);
            return res.status(200).json({ success: true, message: "All Books!", count: books.rows.length, data: books.rows });
        } catch (error) {
            res.status(res.statusCode).json({ success: false, message: "Error Fetching all the Books!", error: error instanceof Error ? error.message : "Unknown Error!" });
            return next(error);
        }
    };

    GetOne: express.Handler = async (req, res, next) => {
        try {
            const book = await this.findById(dBase, String(req.params.id));
            if (!book) return res.status(404).json({ success: false, message: "Book not found!" });
            return res.status(200).json({ success: true, message: "Book", data: book });
        } catch (error) {
            res.status(res.statusCode).json({ success: false, message: "Error Getting one Book!", error: error instanceof Error ? error.message : "Unknown Error!" });
            return next(error);
        }
    };

    Update: express.Handler = async (req, res, next) => {
        const client = await dBase.connect();
        try {
            const book = BCreateSchema.parse(req.body);
            await client.query("BEGIN");
            const updated = await client.query<{ id: number }>(
                `UPDATE books SET barcode=$1, cover_url=$2, title=$3, description=$4, publication_date=$5,
                publisher=$6, pages=$7, genre=$8, updated_at=CURRENT_TIMESTAMP WHERE id=$9 RETURNING id`,
                [book.barcode, book.cover_url, book.title, book.description, book.publication_date, book.publisher, book.pages, book.genre, req.params.id]
            );
            if (updated.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ success: false, message: "Book not found!" });
            }
            await this.saveRelationships(client, updated.rows[0].id, book);
            const updatedBook = await this.findById(client, updated.rows[0].id);
            await client.query("COMMIT");
            return res.status(200).json({ success: true, message: "The Book was Updated!", data: updatedBook });
        } catch (error) {
            await client.query("ROLLBACK");
            res.status(res.statusCode).json({ success: false, message: "Error Updating the Book!", error: error instanceof Error ? error.message : "Unknown Error!" });
            return next(error);
        } finally {
            client.release();
        }
    };

    Delete: express.Handler = async (req, res, next) => {
        try {
            const deleted = await dBase.query<IBook>(
                "DELETE FROM books WHERE id=$1 RETURNING *", 
                [req.params.id]
            );
            if (deleted.rows.length === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Book not found!" });
            };  
            return res
                .status(200)
                .json({
                    success: true, 
                    message: "The Book was Deleted!", 
                    data: deleted.rows[0]
                });
        } catch (error) {
            res
                .status(res.statusCode)
                .json({
                    success: false, 
                    message: "Error Deleting the Book!", 
                    error: error instanceof Error ? 
                    error.message : "Unknown Error!"
                });
            return next(error);
        }
    };
}

export const BOOK: BookClass = new BookClass();


