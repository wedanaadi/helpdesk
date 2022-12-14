import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthConsumer from "../hook/Auth";
import useHookAxios from "../hook/useHookAxios";
import { baseUrl } from "../util/BaseUrl";
import axios from "../util/jsonApi";

export default function Login() {
  const [response, error, loading, axiosFuc] = useHookAxios();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [validation, setValidation] = useState(null);
  const [reload, setReload] = useState(false);
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [authed, dispatch] = AuthConsumer();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    axiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `login`,
      data: form,
    });
  };

  const handleAxios = async () => {
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
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
    }

    if (response && !error && !validation && !loading) {
      toast.update(toastId.current, {
        render: "Successfuly Login",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      localStorage.setItem("auth", response?.access_token);
      localStorage.setItem("userData", JSON.stringify(response?.user_data));
      dispatch({ type: "login" });
      setTimeout(() => {
        setReload(true);
        setAxiosHandle(false);
        navigasi(`${baseUrl}/`, { replace: true });
      }, 1500);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);
  
  useEffect(() => {
    if(authed.auth === true) {
      navigasi(`${baseUrl}/`, { replace: true });
    }
  }, []);


  return (
    <div className="container-fluid">
      <div
        className="row h-100 align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
          <div className="bg-light rounded p-4 p-sm-5 my-4 mx-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <Link to={`${baseUrl}/`}>
                <h3 className="text-primary">
                  <i className="fa fa-hashtag me-2" />
                  DASHMIN
                </h3>
              </Link>
              <h3>Sign In</h3>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Username"
                  name="username"
                  onChange={handleChange}
                />
                <label htmlFor="floatingInput">Username</label>
                {error &&
                  validation?.username?.map((msg, index) => (
                    <div
                      id="kategoriHelp"
                      className="form-text text-danger"
                      key={index}
                    >
                      {msg}
                    </div>
                  ))}
              </div>
              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
                <label htmlFor="floatingPassword">Password</label>
                {error &&
                  validation?.password?.map((msg, index) => (
                    <div
                      id="kategoriHelp"
                      className="form-text text-danger"
                      key={index}
                    >
                      {msg}
                    </div>
                  ))}
              </div>
              <button type="submit" className="btn btn-primary py-3 w-100 mb-4">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
