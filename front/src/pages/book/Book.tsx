import React from "react";
import styles from "./Book.module.css";
import { useParams } from "react-router";
import { BookAPI } from "../../global/BookAPI";
import { Spinner } from "../../components/spin/Spinner";

export const Book = () => {
    const { id } = useParams();
    const bookID = id !== undefined ? Number(id) : 0;
    const { error, isLoading, 
        data } = BookAPI.useOneBookQuery(bookID);
    const BOOK = data?.data;

    if (error) {
        if ("status" in error) {
            const errMSG = "error" in error ?
                error.error :
                JSON.stringify(error.data);
            return <h1>Error: {errMSG}</h1>
        } else {
            return <h1>Error: {error.message}</h1>
        }
    };

    return (
        <React.Fragment>
            {isLoading ? (
                <Spinner />
            ) : BOOK ? (
                <main>
                    <section className={styles.book__card}>
                        <h1>{BOOK.title}</h1>
                        <img
                            alt={BOOK.title} 
                            src={BOOK.cover_url}  
                        />
                        <p>{BOOK.description}</p>
                        <p>{BOOK.subjects}</p>
                        
                    </section>
                </main>
            ) : null}
        </React.Fragment>
    );
};


