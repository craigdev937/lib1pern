import express from "express";
import { BOOK } from "../controllers/BookCTR.js";

// Routes: localhost:9000/api/books
export const bookRt: express.Router = express.Router();
    bookRt.post("/books", BOOK.Create);
    bookRt.get("/books", BOOK.FetchAll);
    bookRt.get("/books/:id", BOOK.GetOne);
    bookRt.put("/books/:id", BOOK.Update);
    
    
    
    
    // bookRt.delete("/books/:id", BOOK.Delete);



