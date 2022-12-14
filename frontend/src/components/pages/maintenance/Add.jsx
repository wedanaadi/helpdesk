import React, { useEffect, useReducer, useRef, useState } from "react";
import useHookAxios from "../../hook/useHookAxios";
import Select from "../../Select";
import {
  INITIAL_STATE,
  maintenanceReducer,
} from "../../reducer/maintenaceReducer";
import axios from "../../util/jsonApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../util/BaseUrl";

export default function ModalMaintenace({ ticket }) {
  const closeModal = useRef(null);
  const [teknisi, errTeknisi, loadingTeknisi, pelFunc] = useHookAxios();
  const [selectTeknisi, setTeknisi] = useState(null);
  const [state, dispatch] = useReducer(maintenanceReducer, INITIAL_STATE);
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();

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
      url: `teknisi-select`,
      data: null,
      reqConfig: {
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
          name: "ticket_keluhan",
          value: ticket,
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
          name: "teknisi",
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
      url: `maintenance`,
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
      closeModal.current.click();
      toast.update(toastId.current, {
        render: "Successfuly created",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
      navigasi(`${baseUrl}/maintenance`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <div
      className="modal fade"
      id="commentModal"
      tabIndex="-1"
      aria-labelledby="commentMdLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="commentMdLabel">
              Buat Ticket Maintenance Keluhan
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-body">
              <div className="row p-2">
                <div className="mb-3">
                  <label htmlFor="namaTeknisi" className="form-label">
                    Nomor Keluhan
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="ticket_keluhan"
                    className="form-control"
                    value={state.ticket_keluhan}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="namaTeknisi" className="form-label">
                    Nama Teknisi
                  </label>
                  <Select
                    options={teknisi}
                    placeHolder={"Teknisi"}
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
                    name="note"
                    className="form-control"
                    rows={5}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="py-3 px-2 border-top d-flex flex-row-reverse">
                <button type="submit" className="btn btn-primary">
                  Buat Ticket
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
