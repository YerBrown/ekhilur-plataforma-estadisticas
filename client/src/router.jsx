import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import Authentication from "./pages/authenticaction/Authentication";
import Home from "./pages/home/home";
import Transactions from "./pages/transactions/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./pages/errorBoundary/ErrorBoundary";
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
                path: "/transactions",
                element:
                    <Transactions />
            },
            {
                path: "*",
                element: <ErrorBoundary />,
            },
            // {
            //     path: "/user",
            //     element: <ContactPage />,
            // },
        ],
    },
]);
export default router;
