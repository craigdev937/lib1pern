import React from "react";
import classes from "./Home.module.css";
import { Link } from "react-router";
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
                <main className={classes.book__grid}>
                    {data && data.data.map((book) => (
                        <aside 
                            key={book.id} 
                            className={classes.book}
                        >
                            <Link to={`/book/${book.id}`}>
                                <img src={book.cover_url} alt={book.title} />
                            </Link>
                        </aside>
                    ))}
                </main>
            )}
        </React.Fragment>
    );
};


