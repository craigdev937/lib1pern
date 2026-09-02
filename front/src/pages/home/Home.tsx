import React from "react";
import classes from "./Home.module.css";
import { BookAPI } from "../../global/BookAPI";
import { Spinner } from "../../components/spin/Spinner";

export const Home = () => {
    const { error, isLoading, 
        data } = BookAPI.useAllBooksQuery();
    
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
            ) : (
                <main>
                    {data && data.data.map((book) => (
                        <section key={book.id}>
                            <h1>{book.title}</h1>
                            <img src={book.cover_url} alt={book.title} />
                            <p>{book.description}</p>
                        </section>
                    ))}
                </main>
            )}
        </React.Fragment>
    );
};


