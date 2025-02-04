import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        if (user !== null) {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return <Navigate to="/authentication" />;
    }

    return children;
};

export default ProtectedRoute;