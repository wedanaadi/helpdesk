import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import useHookAxios from "../../hook/useHookAxios";
import axios from "../../util/jsonApi";
import {
  updateMaintenanceReducer,
  INITIAL_STATE,
} from "../../reducer/updateMaintenanceReducer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../util/BaseUrl";

export default function ModalUpdate({
  toggleModal,
  setState,
  data,
  aksiUpdate,
}) {
  const [response, error, loading, actionAxios] = useHookAxios();
  const [state, dispatch] = useReducer(updateMaintenanceReducer, INITIAL_STATE);
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();
  const LoginUser = JSON.parse(localStorage.getItem('userData'))

  const handleClose = () => {
    setState(false);
  };

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
    actionAxios({
      axiosInstance: axios,
      method: "PUT",
      url: `maintenance/status/${data.id}`,
      data: state,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
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
      actionAxios({
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
      toast.update(toastId.current, {
        render: "Successfuly updated Status",
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

  useEffect(() => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "status", value: aksiUpdate },
    });
    // const aksi = type;
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: "ticket_keluhan",
        value: data?.tiket_keluhan ? data.tiket_keluhan : "",
      },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: "ticket_maintenance",
        value: data?.tiket_maintenance ? data.tiket_maintenance : "",
      },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: "pegawai_id",
        value: data?.pegawai_id ? data?.pegawai_id : "",
      },
    });
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: "user_update",
        value: LoginUser.idUser,
      },
    });
  }, [toggleModal]);

  return (
    <>
      <Modal show={toggleModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Ticket Maintenance</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row p-2">
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
                {/* {error &&
                  validation?.deskripsi?.map((msg, index) => (
                    <div
                      id="namaTeknisiHelp"
                      className="form-text text-danger"
                      key={index}
                    >
                      {msg}
                    </div>
                  ))} */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Update Perubahan
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
