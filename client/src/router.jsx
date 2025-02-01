import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import Authentication from "./pages/authenticaction/Authentication";
import Home from "./pages/home/Home";
import Transactions from "./pages/transactions/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./pages/errorBoundary/ErrorBoundary";
import Sales from "./pages/sales/Sales";
import UserBonifications from "./pages/bonifications/UserBonifications";
import Estadisticas from "./pages/estadisticas/Estadisticas";

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
                element: <Transactions />,
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
                element: <UserBonifications />,
            },

            {
                path: "/estadistics",
                element: <Estadisticas />,
            },
        ],
    },
]);
export default router;
