import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useHookAxios from "../hook/useHookAxios";
import Select from "../Select";
import { baseUrl } from "../util/BaseUrl";
import axios from "../util/jsonApi";
import {
  sendReducer,
  INITIAL_STATE,
} from "../reducer/notifikasiReducer";
import { toast } from "react-toastify";

export default function Notifikasi() {
  const [teknisi, errTeknisi, loadingTeknisi, pelFunc] = useHookAxios();
  const [selectTeknisi, setTeknisi] = useState(null);
  const [keluhan, errKeluhan, loadingKeluhan, kelFunc] = useHookAxios();
  const [selectKeluhan, setKeluhan] = useState(null);
  const [state, dispatch] = useReducer(sendReducer, INITIAL_STATE);
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();
  const LokalData = JSON.parse(localStorage.getItem('userData'))

  const handleChange = (e) => {
    
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const getTeknisi = () => {
    pelFunc({
      axiosInstance: axios,
      method: "GET",
      url: `sender-select`,
      data: null,
      reqConfig: {
        params: {
          idUser: LokalData.idUser
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const inv = setTimeout(() => {
      getTeknisi();
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "pengirim",
          value: LokalData.idUser,
        },
      });
    }, 1);
    return () => clearInterval(inv);
  }, []);

  useEffect(() => {
    const Inv = setTimeout(() => {
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "penerima",
          value: selectTeknisi?.value ? selectTeknisi?.value : "",
        },
      });
    }, 1);
    return () => {
      clearInterval(Inv);
    };
  }, [selectTeknisi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `sendChat`,
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
      navigasi(0);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <div className="row col-12 bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Kirim Pesan</h3>
        <Link to={-1} className="btn btn-secondary mb-0">
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp; Kembali
        </Link>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="row p-2">
          <div className="mb-3">
            <label htmlFor="namaTeknisi" className="form-label">
              Penerima
            </label>
            <Select
              options={teknisi}
              placeHolder={"Penerima"}
              getter={selectTeknisi}
              setter={setTeknisi}
            />
            {error &&
              validation?.teknisi?.map((msg, index) => (
                <div
                  id="namaTeknisiHelp"
                  className="form-text text-danger"
                  key={index}
                >
                  {msg}
                </div>
              ))}
          </div>
          <div className="mb-3">
            <label htmlFor="namaTeknisi" className="form-label">
              Note
            </label>
            <textarea
              name="pesan"
              className="form-control"
              rows={5}
              onChange={handleChange}
              value={state.pesan}
            >
            </textarea>
          </div>
        </div>
        <div className="py-3 px-2 border-top d-flex flex-row-reverse">
          <button type="submit" className="btn btn-primary">
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
