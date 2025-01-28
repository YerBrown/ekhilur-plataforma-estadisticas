import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import Authentication from "./pages/authenticaction/Authentication";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./pages/errorBoundary/ErrorBoundary";
import Sales from "./pages/sales/Sales";
import Bonifications from "./pages/bonifications/Bonifications";

import MapPage from "./pages/map/MapPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/authentication",
                element: <Authentication />,
            },
            {
                path: "*",
                element: <ErrorBoundary />,
            },
            {
                path: "/sales",
                element: <Sales />,
            },

            {
                path: "/bonifications",
                element: <Bonifications />,
            },
            {
                path: "/map",
                element: <MapPage  />,
            },
            // {
            //     path: "/user",
            //     element: <ContactPage />,
            // },
        ],
    },
]);
export default router;
