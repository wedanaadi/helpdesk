import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import SWRContext from "../context/Chat";
import useHookAxios from "../hook/useHookAxios";
import axios from "../util/jsonApi";
import { baseUrl } from "../util/BaseUrl";

export default function Home() {
  const [sidebarOpen, setSidebar] = useState(false);

  const [queue, error, loading, AxiosFuction] = useHookAxios();
  const [email, errorE, loadingE, emailFuction] = useHookAxios();
  const [queue1, error1, loading1, AxiosFuction1] = useHookAxios();
  let hitungQueue = 0;

  const getQueue = () => {
    AxiosFuction({
      axiosInstance: axios,
      method: "GET",
      url: `get-queue`,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      getQueue()
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    // queue.length > 0 && console.log(JSON.parse(queue[0].task));
    queue.length > 0 && queue.map((row,index) => {
      // console.log(row);
      emailFuction({
        axiosInstance: axios,
        method: "POST",
        url: row.url,
        data: JSON.parse(row.task),
        reqConfig: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        },
      });
      hitungQueue+=1;
      if(hitungQueue===queue.length) {
        AxiosFuction1({
          axiosInstance: axios,
          method: "POST",
          url: `delete-queue`,
          data: null,
          reqConfig: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          },
        });
      }
    })
  },[queue])


  return (
    <>
      <SWRContext>
        <div className="container-fluid position-relative bg-white d-flex p-0">
          <Sidebar sidebarOpen={sidebarOpen} />
          <div className={sidebarOpen ? "content open" : "content"}>
            <Navbar sidebarOpen={sidebarOpen} setSidebar={setSidebar} />
            <div className="container-fluid pt-4 px-4">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      </SWRContext>
    </>
  );
}
