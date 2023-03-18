import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHookAxios from "../../hook/useHookAxios";
import Select from "../../Select";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";

export default function ModalChangePegawai({
  toogleShow,
  setClose,
  dataDetail,
}) {
  const [teknisi, errTeknisi, loadingTeknisi, pelFunc] = useHookAxios();
  const [emailCancel, errEmailCancel, loadingEmailCancel, emailCancelFuc] = useHookAxios();
  const [emailNew, errEmailNew, loadingEmailNew, emailNewFuc] = useHookAxios();
  const [selectTeknisi, setTeknisi] = useState(null);
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const lokalUser = JSON.parse(localStorage.getItem("userData"));

  const handleClose = () => {
    setClose(false);
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
    getTeknisi();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "PUT",
      url: `maintenance/teknisiChange/${dataDetail.id}`,
      data: {
        prevTeknisi: dataDetail.teknisi.id,
        prevEmailTeknisi: dataDetail.teknisi.email,
        newTeknisi: selectTeknisi,
        ticket_maintenance: dataDetail.tiket_maintenance,
        ticket_keluhan: dataDetail.tiket_keluhan,
        user_update: lokalUser.idUser
      },
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
      emailNewFuc({
        axiosInstance: axios,
        method: "POST",
        url: `maintenance/sendEmail/t`,
        data: response.emailBaru,
        reqConfig: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        },
      });
      emailCancelFuc({
        axiosInstance: axios,
        method: "POST",
        url: `maintenance/sendEmail`,
        data: response.emailPembatalan,
        reqConfig: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        },
      });
      handleClose();
      // closeModal.current.click();
      toast.update(toastId.current, {
        render: "Successfuly Import Data...",
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
    <>
      <Modal show={toogleShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ganti Penugasan Teknisi</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row p-2">
              <div className="mb-3">
                <label htmlFor="extendDate" className="form-label">
                  Teknisi Sebelumnya
                </label>
                <input
                  type="text"
                  name="extendDate"
                  className="form-control"
                  value={dataDetail.teknisi.nama_pegawai}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="extendDate" className="form-label">
                  Teknisi Baru
                </label>
                <Select
                  options={teknisi}
                  placeHolder={"Teknisi"}
                  getter={selectTeknisi}
                  setter={setTeknisi}
                />
                {error &&
                validation?.newTeknisi?.map((msg, index) => (
                  <div
                    id="errorText"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Simpan
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
