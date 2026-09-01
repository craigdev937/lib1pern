import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { NotFound } from "../components/NotFound";
import { Navbar } from "./Navbar";
import { Home } from "../pages/home/Home";
import { Catalog } from "../pages/cat/Catalog";
import { Profile } from "../pages/pro/Profile";
import { Resource } from "../pages/res/Resource";

const RouteList = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/catalog",
                element: <Catalog />
            },
            {
                path: "/resource/:barcode",
                element: <Resource />
            },
            {
                path: "/profile/:userId",
                element: <Profile />
            }
        ]
    }
]);

export const NavRoutes = () => {
    return (
        <React.Fragment>
            <RouterProvider router={RouteList} />
        </React.Fragment>
    );
};




