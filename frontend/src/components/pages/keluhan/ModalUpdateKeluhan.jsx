import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHookAxios from "../../hook/useHookAxios";
import Select from "../../Select";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";
import {
  updateKelurahanReducer,
  INITIAL_STATE,
} from "../../reducer/updateKeluhanReducer";
import { useNotifikasi } from "../../context/Chat";

export default function ModalUpdateKeluhan({ toggleModal, setState, data }) {
  const [teknisi, errTeknisi, loadingTeknisi, pelFunc] = useHookAxios();
  const [sendEmailTeknisi, errET, loadingET, teknisiSendFunc] = useHookAxios();
  const [selectTeknisi, setTeknisi] = useState(null);
  const [selectTipe, setTipe] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();
  const [response, error, loading, actionAxios] = useHookAxios();
  const [state, dispatch] = useReducer(updateKelurahanReducer, INITIAL_STATE);
  const dataLogin = JSON.parse(localStorage.getItem('userData'));
  const {mutate} = useNotifikasi()

  const optionTipes = [
    {
      value: "0",
      label: "Ubah status ke ON PROSES",
    },
    {
      value: "1",
      label: "Selesaikan dengan sistem",
    },
    {
      value: "2",
      label: "Tugaskan Teknisi",
    },
  ];

  const handleClose = () => {
    setState(false);
  };

  // dispatch data
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
    }, 1);
    return () => clearInterval(inv);
  }, []);

  const handleSumbit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    if (selectTipe.value == "1") {
      actionAxios({
        axiosInstance: axios,
        method: "PUT",
        url: `keluhan/status/${data.id}`,
        data: state,
        reqConfig: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        },
      });
    } else if(selectTipe.value == "0") {
      actionAxios({
        axiosInstance: axios,
        method: "PUT",
        url: `keluhan/status-proccess/${data.id}`,
        data: state,
        reqConfig: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        },
      });
    } else {
      actionAxios({
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
    }
    setAxiosHandle(true);
  };

  const handleAxios = () => {
    let message = "Error";
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
      mutate('keluhan')
      toast.update(toastId.current, {
        render: "Successfuly updated Status",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
      if (selectTipe.value == "2") {
        pelFunc({
          axiosInstance: axios,
          method: "POST",
          url: `maintenance/sendEmail`,
          data: response.email,
          reqConfig: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          },
        });
        teknisiSendFunc({
          axiosInstance: axios,
          method: "POST",
          url: `maintenance/sendEmail/t`,
          data: response.emailTeknisi,
          reqConfig: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          },
        });
        navigasi(`${baseUrl}/maintenance`);
      } else if(selectTipe.value == "0") {
        pelFunc({
          axiosInstance: axios,
          method: "POST",
          url: `keluhan/sendEmail`,
          data: response.email,
          reqConfig: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          },
        });
        navigasi(`${baseUrl}/keluhan`);
      } else {
        pelFunc({
          axiosInstance: axios,
          method: "POST",
          url: `keluhan/sendEmail`,
          data: response.email,
          reqConfig: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth")}`,
            },
          },
        });
        navigasi(`${baseUrl}/keluhan`);
      }
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  useEffect(() => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: "teknisi",
        value: selectTeknisi?.value ? selectTeknisi.value : "",
      },
    });
  }, [selectTeknisi]);

  useEffect(() => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: "status",
        value: selectTipe?.value ? selectTipe.value : "",
      },
    });
  }, [selectTipe]);

  useEffect(() => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "keluhan_id", value: data?.id ? data.id : "" },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "ticket_keluhan", value: data?.tiket ? data.tiket : "" },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "user_update", value: dataLogin?.idUser ? dataLogin?.idUser : "" },
    });
  }, [toggleModal]);

  return (
    <>
      <Modal show={toggleModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Ticket Keluhan</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSumbit}>
          <Modal.Body>
            <div className="row p-2">
              <div className="mb-3">
                <label htmlFor="namaTeknisi" className="form-label">
                  Tipe Aksi
                </label>
                <Select
                  options={optionTipes}
                  placeHolder={"Aksi"}
                  getter={selectTipe}
                  setter={setTipe}
                />
              </div>
              {selectTipe?.value == "2" ? (
                <>
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
                </>
              ) : (
                false
              )}
              {selectTipe?.value == "1" || selectTipe?.value == "0" ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="namaTeknisi" className="form-label">
                      Deskripsi Update Penanganan
                    </label>
                    <textarea
                      name="deskripsi"
                      className="form-control"
                      rows={5}
                      value={state.deskripsi}
                      onChange={handleChange}
                    />
                    {error &&
                      validation?.deskripsi?.map((msg, index) => (
                        <div
                          id="namaTeknisiHelp"
                          className="form-text text-danger"
                          key={index}
                        >
                          {msg}
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                false
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectTipe?.value ? (
              <Button type="submit" variant="primary">
                Update Perubahan
              </Button>
            ) : (
              false
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
