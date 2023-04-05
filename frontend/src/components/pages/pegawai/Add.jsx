import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../util/BaseUrl";
import { pegawaiReducer, INITIAL_STATE } from "../../reducer/pegawaiReducer";
import axios from "../../util/jsonApi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRef } from "react";
import useHookAxios from "../../hook/useHookAxios";
import Select from "../../Select";

export default function AddPegawai() {
  const [response, error, loading, axiosFuc] = useHookAxios();
  const [state, dispatch] = useReducer(pegawaiReducer, INITIAL_STATE);
  const [validation, setValidation] = useState(null);
  const [reload, setReload] = useState(false);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [jabatan, setJabatan] = useState({});
  const [axiosHandle, setAxiosHandle] = useState(false);

  const optionsRole = [
    {
      value: 1,
      label: "Admin",
    },
    {
      value: 2,
      label: "Helpdesk",
    },
    {
      value: 3,
      label: "Teknisi",
    },
  ];

  useEffect(() => {
    const Inv = setTimeout(() => {
      dispatch({
        type: "CHANGE_INPUT",
        payload: { name: "role", value: jabatan.value },
      });
    }, 1);
    return () => {
      clearInterval(Inv);
    };
  }, [jabatan]);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true)
    toastId.current = toast.loading("Please wait...");
    axiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `pegawai`,
      data: state,
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
      axiosFuc({
        axiosInstance: axios,
        method: "POST",
        url: `pegawai/sendEmail`,
        data: response.email,
        reqConfig: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        },
      });
      toast.update(toastId.current, {
        render: "Successfuly created",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setReload(true);
      setAxiosHandle(false)
      navigasi(`${baseUrl}/pegawai`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  //! NOTE: kode untuk view
  return (
    <div className="row col-12 bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Tambah Pegawai</h3>
         {/* NOTE : Tombol kembali */}
        <Link to={`${baseUrl}/pegawai`} className="btn btn-secondary mb-0">
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp; Kembali
        </Link>
      </div>
      <form className="px-0" autoComplete="off" onSubmit={handleSubmit}>
        <div className="row py-2 px-2">
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="namaPegawai" className="form-label">
                Nama Pegawai
              </label>
               {/* NOTE : Input untuk pegawai */}
              <input
                type="text"
                name="nama_pegawai"
                className="form-control"
                id="namaPegawai"
                aria-describedby="namaPegawaiHelp"
                onChange={handleChange}
                value={state.nama_pegawai}
              />
              {error &&
                validation?.nama_pegawai?.map((msg, index) => (
                  <div
                    id="namaPegawaiHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
               {/* NOTE : Input untuk email */}
              <input
                type="email"
                name="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                onChange={handleChange}
                value={state.email}
              />
              {error &&
                validation?.email?.map((msg, index) => (
                  <div
                    id="emailHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="telepon" className="form-label">
                Telepon
              </label>
               {/* NOTE : Input untuk telepon */}
              <input
                type="text"
                name="telepon"
                className="form-control"
                id="telepon"
                aria-describedby="teleponHelp"
                onChange={handleChange}
                value={state.telepon}
              />
              {error &&
                validation?.telepon?.map((msg, index) => (
                  <div
                    id="teleponHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
               {/* NOTE : Input untuk username */}
              <input
                type="text"
                name="username"
                className="form-control"
                id="username"
                aria-describedby="usernameHelp"
                onChange={handleChange}
                value={state.username}
              />
              {error &&
                validation?.username?.map((msg, index) => (
                  <div
                    id="usernameHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
               {/* NOTE : Input untuk password */}
              <input
                type="password"
                name="password"
                className="form-control"
                id="password"
                aria-describedby="passwordHelp"
                onChange={handleChange}
                value={state.password}
              />
              {error &&
                validation?.password?.map((msg, index) => (
                  <div
                    id="passwordHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Jabatan
              </label>
               {/* NOTE : Input untuk jabatan */}
              <Select
                options={optionsRole}
                placeHolder={"Page"}
                getter={jabatan}
                setter={setJabatan}
              />
              {error &&
                validation?.role?.map((msg, index) => (
                  <div
                    id="roleHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="alamat" className="form-label">
                Alamat
              </label>
               {/* NOTE : Input untuk alamat */}
              <textarea
                name="alamat"
                id="alamat"
                className="form-control"
                value={state.alamat}
                onChange={handleChange}
              ></textarea>
              {error &&
                validation?.alamat?.map((msg, index) => (
                  <div
                    id="alamatHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="py-3 px-2 border-top d-flex flex-row-reverse">
           {/* NOTE : Tombol Simpan */}
          <button type="submit" className="btn btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
