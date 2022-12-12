import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./Routes";
import "bootstrap";
import "@popperjs/core";
import "./App.css";
import { ToastContainer } from "react-toastify";

const routes = createBrowserRouter(Routes);

export default function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={routes} />;
    </>
  );
}
