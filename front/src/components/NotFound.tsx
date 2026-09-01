import React from "react";
import { Link, useRouteError } from "react-router";

export const NotFound = () => {
    const error = useRouteError() as Error;

    return (
        <React.Fragment>
            <h1>That Page wasn't Found! 😨</h1>
            <pre>{error.message}</pre>
            <Link to={"/"}>
                <button>
                    Back to the Home Page!
                </button>
            </Link>
        </React.Fragment>
    );
};


