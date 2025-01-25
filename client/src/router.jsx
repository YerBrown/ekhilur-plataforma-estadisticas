import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import Authentication from "./pages/authenticaction/Authentication";
import Home from "./pages/home/home";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/authentication",
                element: <Authentication />,
            },
            // {
            //     path: "/user",
            //     element: <ContactPage />,
            // },
        ],
    },
]);
export default router;
