import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./Root.css";

const Root = () => {
    return <Outlet />;
};

export default Root;
