import React from "react";
import { render, hydrate } from "react-dom";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    rootElement
);
