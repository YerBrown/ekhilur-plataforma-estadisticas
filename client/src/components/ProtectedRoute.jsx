import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, checkUser } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        handleLogout();
    }, [user]);

    const handleLogout = async () => {
        setLoading(true);
        await checkUser();
        setLoading(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return <Navigate to="/authentication" />;
    }

    return children;
};

export default ProtectedRoute;