import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/root/Root";
import Authentication from "./pages/authenticaction/Authentication";
import Home from "./pages/home/Home";
import Transactions from "./pages/transactions/Transactions";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./pages/errorBoundary/ErrorBoundary";
import SalesCommerce from "./pages/sales/SalesCommerce";
import UserBonifications from "./pages/bonifications/UserBonifications";
import CommerceBonifications from "./pages/commerce-bonifications/CommerceBonifications";
import Estadisticas from "./pages/estadisticas/Estadisticas";
import UserPage from "./pages/userpage/UserPage";

import MapPage from "./pages/map/MapPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/authentication",
                element: <Authentication />,
            },
            {
                path: "",
                element: (
                    <ProtectedRoute allowedRoles={["user", "commerce"]}>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/transactions",
                element: (
                    <ProtectedRoute allowedRoles={["user", "commerce"]}>
                        <Transactions />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/sales",
                element: (
                    <ProtectedRoute allowedRoles={["commerce"]}>
                        <SalesCommerce />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/bonifications",
                element: (
                    <ProtectedRoute allowedRoles={["user"]}>
                        <UserBonifications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/bonifications-shop",
                element: (
                    <ProtectedRoute allowedRoles={["commerce"]}>
                        <CommerceBonifications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/statistics",
                element: (
                    <ProtectedRoute allowedRoles={["user", "commerce"]}>
                        <Estadisticas />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/map",
                element: (
                    <ProtectedRoute allowedRoles={["user", "commerce"]}>
                        <MapPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
export default router;
