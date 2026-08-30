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
    id: z.number(),
    barcode: z.string(),
    cover_url: z.string(),
    title: z.string(),
    description: z.string(),
    publication_date: z.date(),
    publisher: z.string(),
    pages: z.number(),
    genre: z.string(),
    authors: z.array(z.string()),
    subjects: z.array(z.string()),
    created_at: z.string(),
    updated_at: z.string()
});

// For Create/Update Requests 
// Without ID and Timestamps
export const BCreateSchema = BSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
});

export type BType = z.infer<typeof BSchema>;
export type BCreateType = z.infer<typeof BCreateSchema>;



