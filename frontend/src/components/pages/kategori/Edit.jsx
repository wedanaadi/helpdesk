import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseUrl } from "../../util/BaseUrl";
import { kategoriReducer, INITIAL_STATE } from "../../reducer/kategoriReducer";
import axios from "../../util/jsonApi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRef } from "react";
import useHookAxios from "../../hook/useHookAxios";

export default function EditKategori() {
  const [response, error, loading, axiosFuc] = useHookAxios();
  const [state, dispatch] = useReducer(kategoriReducer, INITIAL_STATE);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [axiosHandle, setAxiosHandle] = useState(false);

  const dataEdit = JSON.parse(atob(localStorage.getItem("dataEdit")));
  const loadEdit = () => {
    for (const key in dataEdit) {
      dispatch({
        type: "CHANGE_INPUT",
        payload: { 
          name: key,
          value: dataEdit[key]
         },
      });
    }
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      loadEdit();
    }, 1);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    axiosFuc({
      axiosInstance: axios,
      method: "PUT",
      url: `kategori/${state.id}`,
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
      setAxiosHandle(false);
    }

    if (response && !error && !validation && !loading) {
      toast.update(toastId.current, {
        render: "Successfuly updated",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      navigasi(`${baseUrl}/kategori`);
      setAxiosHandle(false);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <div className="row col-12 col-xl-6 bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Ubah Kategori</h3>
        <Link to={`${baseUrl}/kategori`} className="btn btn-secondary mb-0">
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp; Kembali
        </Link>
      </div>
      <form className="px-0" autoComplete="off" onSubmit={handleSubmit}>
        <div className="py-2 px-2">
          <div className="mb-3">
            <label htmlFor="namaKategori" className="form-label">
              Kategori
            </label>
            <input
              type="text"
              name="nama_kategori"
              className="form-control"
              id="namaKategori"
              aria-describedby="kategoriHelp"
              onChange={handleChange}
              value={state.nama_kategori}
            />
            {error &&
              validation?.nama_kategori?.map((msg, index) => (
                <div
                  id="kategoriHelp"
                  className="form-text text-danger"
                  key={index}
                >
                  {msg}
                </div>
              ))}
          </div>
        </div>
        <div className="py-3 px-2 border-top d-flex flex-row-reverse">
          <button type="submit" className="btn btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
