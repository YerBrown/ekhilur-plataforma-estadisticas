import React from "react";
import router from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
function App() {
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
