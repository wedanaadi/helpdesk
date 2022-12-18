import React, { Suspense, useState } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import SWRContext from "../context/Chat";

export default function Home() {
  const [sidebarOpen, setSidebar] = useState(false);
  return (
    <>
      {/* <SWRContext> */}
        <div className="container-xxl position-relative bg-white d-flex p-0">
          <Sidebar sidebarOpen={sidebarOpen} />
          <div className={sidebarOpen ? "content open" : "content"}>
            <Navbar sidebarOpen={sidebarOpen} setSidebar={setSidebar} />
            <div className="container-fluid pt-4 px-4">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      {/* </SWRContext> */}
    </>
  );
}
