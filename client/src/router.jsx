import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import Authentication from "./pages/authenticaction/Authentication";
import Home from "./pages/home/Home";
import Transactions from "./pages/transactions/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./pages/errorBoundary/ErrorBoundary";
import Bonifications from "./pages/bonifications/Bonifications";
import SalesCommerce from "./pages/sales/SalesCommerce";
import UserBonifications from "./pages/bonifications/UserBonifications";
import CommerceBonifications from "./pages/commerce-bonifications/CommerceBonifications";
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
                element: <SalesCommerce />,
            },
            {
                path: "/bonifications",
                element: <UserBonifications />,
            },
            {
                path: "/bonifications-shop",
                element: <CommerceBonifications />,
            },
            {
                path: "/statistics",
                element: <Estadisticas />,
            },
        ],
    },
]);
export default router;
