import React, { useEffect, useReducer, useRef, useState } from "react";
import axios from "../../util/jsonApi";
import Select from "../../Select";
import useHookAxios from "../../hook/useHookAxios";
import { kelurahanReducer, INITIAL_STATE } from "../../reducer/keluhanReducer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../util/BaseUrl";
import oriAxios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function KeluhanAddPelanggan() {
  const [pelanggan, errPelanggan, loadingPelanggan, pelFunc] = useHookAxios();
  const [kategori, errKategori, loadingKategori, katFunc] = useHookAxios();
  const [selectPelanggan, setPelanggan] = useState(null);
  const [selectKategori, setKategori] = useState(null);
  const [state, dispatch] = useReducer(kelurahanReducer, INITIAL_STATE);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const LocalUser = JSON.parse(localStorage.getItem("userData"));

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const getPelanggan = () => {
    pelFunc({
      axiosInstance: axios,
      method: "GET",
      url: `pelanggan-select`,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  const getKategori = () => {
    katFunc({
      axiosInstance: axios,
      method: "GET",
      url: `kategori-select`,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const Inv = setTimeout(() => {
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "pelanggan",
          value: selectPelanggan?.value ? selectPelanggan?.value : "",
        },
      });
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "kategori",
          value: selectKategori?.value ? selectKategori?.value : "",
        },
      });
    }, 1);
    return () => {
      clearInterval(Inv);
    };
  }, [selectKategori, selectPelanggan]);

  useEffect(() => {
    const inv = setTimeout(() => {
      getKategori();
      getPelanggan();
    }, 1);
    return () => clearInterval(inv);
  }, []);

  const handleFile = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {name:'files', value:[]},
    });
    dispatch({
      type: "CHANGE_FILE",
      payload: e.target.files,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `keluhan`,
      data: state,
      reqConfig: {
        headers: {
          "Content-Type": "multipart/form-data",
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
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
    }

    if (response && !error && !validation && !loading) {
      toast.update(toastId.current, {
        render: "Successfuly created",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
      navigasi(`${baseUrl}/keluhan/pelanggan`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  useEffect(() => {
    const inv = setTimeout(() => {
      const selected = pelanggan.filter(({value})=>value == LocalUser.idUser)
        setPelanggan(selected[0]);
    }, 1);
    return () => clearInterval(inv);
  }, [pelanggan]);

  return (
    <div className="row col-6 bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Ajukan Keluhan</h3>
        <Link to={`${baseUrl}/keluhan/pelanggan`} className="btn btn-secondary mb-0">
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp; Kembali
        </Link>
      </div>
      <form autoComplete="off" className="px-0" onSubmit={handleSubmit}>
        <div className="row p-2">
          <div className="mb-3">
            <label htmlFor="namaPelanggan" className="form-label">
              Nama Pelanggan
            </label>
            <Select
              disabled={true}
              options={pelanggan}
              placeHolder={"Pelanggan"}
              getter={selectPelanggan}
              setter={setPelanggan}
            />
            {error &&
              validation?.pelanggan?.map((msg, index) => (
                <div
                  id="namaPelangganHelp"
                  className="form-text text-danger"
                  key={index}
                >
                  {msg}
                </div>
              ))}
          </div>
          <div className="mb-3">
            <label htmlFor="namaPelanggan" className="form-label">
              Kategori
            </label>
            <Select
              options={kategori}
              placeHolder={"Kategori"}
              getter={selectKategori}
              setter={setKategori}
            />
            {error &&
              validation?.kategori?.map((msg, index) => (
                <div
                  id="namaPelangganHelp"
                  className="form-text text-danger"
                  key={index}
                >
                  {msg}
                </div>
              ))}
          </div>
          <div className="mb-3">
            <label htmlFor="fileForm" className="form-label">
              Lampiran
            </label>
            <input
              className="form-control"
              name="files"
              type="file"
              // id="fileForm"
              multiple
              onChange={handleFile}
            />

            {/* {error &&
                validation?.nama_pelanggan?.map((msg, index) => (
                  <div
                    id="namaPelangganHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))} */}
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Komentar
            </label>
            <textarea
              name="komentar"
              id="komentar"
              className="form-control"
              rows={10}
              value={state.komentar}
              onChange={handleChange}
            ></textarea>
            {error &&
              validation?.komentar?.map((msg, index) => (
                <div
                  id="commentHelp"
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
