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
                <main className={styles.book}>
                    <section 
                        className={styles.book__card} 
                        aria-labelledby="book-title"
                    >
                        <img
                            className={styles.cover}
                            alt={BOOK.title} 
                            src={BOOK.cover_url}  
                        />
                        <aside className={styles.details}>
                            <h1 
                                id="book-title" 
                                className={styles.title}>
                                    {BOOK.title}
                            </h1>
                            <p className={styles.authors}>
                                {BOOK.authors?.join(", ")}
                            </p>
                            <p className={styles.description}>
                                {BOOK.description}
                            </p>
                        </aside>
                    </section>
                    <section 
                        className={styles.panel} 
                        aria-labelledby="book-subjects"
                    >
                        <h2 id="book-subjects">Book Subjects:</h2>
                        <aside 
                            className={styles.subjects} 
                            tabIndex={0} 
                            role="region" 
                            aria-labelledby="book-subjects"
                        >
                            <p>
                                {BOOK.subjects?.join(", ") || 
                                "No subjects available."}
                            </p>
                        </aside>
                    </section>
                    <section 
                        className={styles.panel} 
                        aria-labelledby="book-information"
                    >
                        <h2 id="book-information">
                            Additional Information about: {BOOK.title}
                        </h2>
                        <dl className={styles.metadata}>
                            <aside>
                                <dt>Published By</dt>
                                <dd>{BOOK.publisher || "Not available"}</dd>
                            </aside>
                            <aside>
                                <dt>Publication Date</dt>
                                <dd>{BOOK.publication_date || "Not available"}</dd>
                            </aside>
                            <aside>
                                <dt>Pages</dt>
                                <dd>{BOOK.pages ?? "Not available"}</dd>
                            </aside>
                            <aside>
                                <dt>Genre</dt>
                                <dd>{BOOK.genre || "Not available"}</dd>
                            </aside>
                        </dl>
                    </section>
                </main>
            ) : null}
        </React.Fragment>
    );
};


