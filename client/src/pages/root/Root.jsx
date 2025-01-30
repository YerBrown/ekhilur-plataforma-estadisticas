import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./Root.css";

const Root = () => {
    return <Outlet />;
};
export default Root;
