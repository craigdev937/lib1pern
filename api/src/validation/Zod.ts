import { z } from "zod";

export const USchema = z.object({
    first: z.string().trim().min(2).max(120),
    last: z.string().trim().min(2).max(120),
    type: z.string().min(2),
    email: z.email().trim().min(3, {
        message: "Email is Required!"
    }),
    password: z.string().trim().min(6, {
        message: "Must be at least Six Characters."
    })
});

export type UType = z.infer<typeof USchema>;

export const LSchema = z.object({
    email: z.email().trim().min(3, {
        message: "Email is Required!"
    }),
    password: z.string().trim().min(6, {
        message: "Must be at least Six Characters."
    })
});

export type LType = z.infer<typeof LSchema>;

export const BSchema = z.object({
    barcode: z.number().min(10),
    cover_url: z.string().trim(),
    title: z.string().trim(),
    authors: z.array(z.string().trim()),
    description: z.string().trim(),
    subjects: z.array(z.string().trim()),
    publication_date: z.coerce.date(),
    publisher: z.string().trim(),
    pages: z.number().int().positive(),
    genre: z.string().trim()
});

export type BType = z.infer<typeof BSchema>;




