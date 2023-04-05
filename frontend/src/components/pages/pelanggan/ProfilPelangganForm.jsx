import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useHookAxios from '../../hook/useHookAxios';
import { INITIAL_STATE, profileReducer } from '../../reducer/profileReducer';
import { baseUrl } from '../../util/BaseUrl';
import axios from "../../util/jsonApi";

export default function ProfilPelangganForm({dataLogin}) {
  const dataProfile = JSON.parse(atob(localStorage.getItem("dataProfile")));
  const baseImageUrl = `${import.meta.env.VITE_STORAGE_BACKEND}/img`;
  const baseImageDefault = `${baseUrl}/img/userlogo.png`;
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);
  const [response, error, loading, saveFunction] = useHookAxios();
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [axiosHandle, setAxiosHandle] = useState(false);

  useState(()=>{
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'idUser',
        value: dataLogin.idUser
       },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'nama',
        value: dataProfile.nama_pelanggan
       },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'email',
        value: dataProfile.email
       },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'telepon',
        value: dataProfile.telepon
       },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'alamat',
        value: dataProfile.alamat
       },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'oldProfile',
        value: dataProfile.profil
       },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { 
        name: 'kordinat',
        value: `${dataProfile.lat}, ${dataProfile.long}`
       },
    });
  },[])

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFiles = (e) => {
    dispatch({
      type: "CHANGE_FILES",
      payload: { name: e.target.name, value: e.target.files[0] },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true)
    toastId.current = toast.loading("Please wait...");
    saveFunction({
      axiosInstance: axios,
      method: "POST",
      url: `profile-change-pelanggan`,
      data: state,
      reqConfig: {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  }

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
      let sessionUpdate = {
        idUser: dataLogin.idUser,
        role: dataLogin.role,
        relasi: response.payload
      }
      localStorage.setItem("userData", JSON.stringify(sessionUpdate));
      toast.update(toastId.current, {
        render: "Successfuly updated",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false)
      navigasi(`${baseUrl}/profile`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  //! NOTE: Kode untuk view
  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="row g-4 mt-1">
          <div className="col-lg-3 mx-0">
            <div className="bg-light rounded p-3">
              <div className="px-3 py-2 text-center">
                 {/* NOTE : Profile Image */}
                <img
                  src={
                    dataProfile.profil === "-"
                      ? baseImageDefault
                      : `${baseImageUrl}/${dataProfile.profil}`
                  }
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: "150px", height: "150px" }}
                />
                 {/* NOTE : Input untuk picture profile */}
                <input
                  type="file"
                  name="profile"
                  className="form-control mt-3"
                  onChange={handleFiles}
                />
                <input
                  type="hidden"
                  name="oldProfile"
                  onChange={handleChange}
                  value={state.oldProfile}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-9 mx-0">
            <div className="bg-light rounded p-3">
              <div className="px-3 py-2">
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="nama" className="form-label">
                      Nama Pelanggan
                    </label>
                     {/* NOTE : Input untuk pelanggan */}
                    <input
                      type="text"
                      name="nama"
                      className="form-control"
                      id="nama"
                      aria-describedby="namaPegawaiHelp"
                      onChange={handleChange}
                      value={state.nama}
                    />
                    {error &&
                      validation?.nama?.map((msg, index) => (
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

                <div className="col-12">
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
                          id="namaPegawaiHelp"
                          className="form-text text-danger"
                          key={index}
                        >
                          {msg}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="col-12">
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
                          id="namaPegawaiHelp"
                          className="form-text text-danger"
                          key={index}
                        >
                          {msg}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="col-12">
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
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="kordinat" className="form-label">
                      Kordinat
                    </label>
                     {/* NOTE : Input untuk kordinat */}
                    <input
                      type="text"
                      name="kordinat"
                      className="form-control"
                      id="kordinat"
                      aria-describedby="teleponHelp"
                      onChange={handleChange}
                      value={state.kordinat}
                    />
                    {error &&
                      validation?.kordinat?.map((msg, index) => (
                        <div
                          id="kordinatHelp"
                          className="form-text text-danger"
                          key={index}
                        >
                          {msg}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="col-12">
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
                    />
                  </div>
                </div>
                <div className="col-12">
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
                    />
                  </div>
                </div>
                <div className="py-3 px-2 border-top d-flex flex-row-reverse">
                   {/* NOTE : Tombol SImpan */}
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
