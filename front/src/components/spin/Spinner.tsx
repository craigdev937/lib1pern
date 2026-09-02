import classes from "./Spinner.module.css";

export const Spinner = () => {
    return (
        <section className={classes.spin__container}>
            <aside className={classes.spinner}>
                Loading...
            </aside>
        </section>
    );
};


