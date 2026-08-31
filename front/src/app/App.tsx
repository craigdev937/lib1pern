import React from "react";
import styles from "./App.module.css";
import Fred from "@public/Fred and Barney.jpg";

export const App = () => {
    return (
        <React.Fragment>
            <h1 className={styles.title}>Fred and Barney</h1>
            <img 
                src={Fred} alt="Fred and Barney" 
                height={"600rem"} width={"auto"}
            />
        </React.Fragment>
    );
};


