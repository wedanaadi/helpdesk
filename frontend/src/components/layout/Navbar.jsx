import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faBars, faBell, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthConsumer from "../hook/Auth";
import useHookAxios from "../hook/useHookAxios";
import { baseUrl } from "../util/BaseUrl";
import axios from "../util/jsonApi";

export default function Navbar({ sidebarOpen, setSidebar }) {
  const LokalUser = JSON.parse(localStorage.getItem('userData'))
  let name="";
  let role=""
  if(LokalUser.role == '5') {
    name = LokalUser.relasi.nama;
    role = "Super User"
  } else if(LokalUser.role == '4') {
    name = LokalUser.relasi.nama_pelanggan
    role = "Pelanggan"
  } else {
    name = LokalUser.relasi.nama_pegawai
    if(LokalUser.role == '1') {
      role = "Admin"
    }else if(LokalUser.role == '2') {
      role = 'Helpdesk'
    } else {
      role = "Teknisi"
    }
  }
  const [response, error, loading, axiosFuc] = useHookAxios();
  const [validation, setValidation] = useState(null);
  const [reload, setReload] = useState(false);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [authed, dispatch] = AuthConsumer();

  const hamburger = () => {
    setSidebar(!sidebarOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setAxiosHandle(true)
    toastId.current = toast.loading("Please wait...");
    axiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `logout`,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };
  const handleAxios = () => {
    let message = "";
    setValidation(null);
    if (!loading && error) {
      if (error.type === "validation") {
        setValidation(error.error);
        message = "Error Validasi";
      } else if (error.type === "bad") {
        setValidation(error?.error);
        message = error?.error;
      } else {
        setValidation(error.error?.statusText);
        message = error.error?.statusText;
      }

      toast.update(toastId.current, {
        render: message.toString(),
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false)
    }

    if (response && !error && !validation && !loading) {
      toast.update(toastId.current, {
        render: "Successfuly Logout",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      // localStorage.setItem("auth", response?.access_token);
      localStorage.clear();
        setReload(true);
        setAxiosHandle(false);
        dispatch({ type: "logout" });
        navigasi(`${baseUrl}/login`, {replace:true});
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
      <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
        <h2 className="text-primary mb-0">
          {/* <i className="fa fa-hashtag" /> */}
          <FontAwesomeIcon icon={faHashtag} />
        </h2>
      </a>
      <a href="#" className="sidebar-toggler flex-shrink-0" onClick={hamburger}>
        {/* <i className="fa fa-bars" /> */}
        <FontAwesomeIcon icon={faBars} />
      </a>
      {/* <form className="d-none d-md-flex ms-4">
        <input
          className="form-control border-0"
          type="search"
          placeholder="Search"
        />
      </form> */}
      <div className="navbar-nav align-items-center ms-auto">
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            {/* <i className="fa fa-envelope me-lg-2" /> */}
            <FontAwesomeIcon icon={faEnvelope} className="me-lg-2" />
            <span className="d-none d-lg-inline-flex">Message</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            <a href="#" className="dropdown-item">
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src={`${baseUrl}/img/user.jpg`}
                  alt="image"
                  style={{ width: 40, height: 40 }}
                />
                <div className="ms-2">
                  <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                  <small>15 minutes ago</small>
                </div>
              </div>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src={`${baseUrl}/img/user.jpg`}
                  alt="image"
                  style={{ width: 40, height: 40 }}
                />
                <div className="ms-2">
                  <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                  <small>15 minutes ago</small>
                </div>
              </div>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item">
              <div className="d-flex align-items-center">
                <img
                  className="rounded-circle"
                  src={`${baseUrl}/img/user.jpg`}
                  alt="image"
                  style={{ width: 40, height: 40 }}
                />
                <div className="ms-2">
                  <h6 className="fw-normal mb-0">Jhon send you a message</h6>
                  <small>15 minutes ago</small>
                </div>
              </div>
            </a>
            <hr className="dropdown-divider" />
            <a href="#" className="dropdown-item text-center">
              See all message
            </a>
          </div>
        </div>
        
        <div className="nav-item dropdown">
          <a
            href="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <img
              className="rounded-circle me-lg-2"
              src={`${baseUrl}/img/user.jpg`}
              alt="image"
              style={{ width: 40, height: 40 }}
            />
            <span className="d-none d-lg-inline-flex">{name}</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
            {/* <a href="#" className="dropdown-item">
              My Profile
            </a>
            <a href="#" className="dropdown-item">
              Settings
            </a> */}
            <button onClick={handleLogout} className="dropdown-item">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
