import React from "react";
import ReactDOM from "react-dom/client";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";
import App from "./App";
import { setupApi } from "@shared/api";
import { useAuthStore } from "@entities/user";

setupApi(
  () => useAuthStore.getState().token,
  () => useAuthStore.getState().logout(),
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
