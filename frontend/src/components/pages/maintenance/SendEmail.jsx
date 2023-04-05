import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHookAxios from "../../hook/useHookAxios";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi"

export default function SendEmail({ toggleModal, setState, data, type }) {
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleClose = () => {
    setState(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `sendEmail`,
      data: {
        email: data?.teknisi?.email,
        subject,
        body,
        ticket: data?.tiket_maintenance,
        type
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
      handleClose();
      // closeModal.current.click();
      toast.update(toastId.current, {
        render: "Successfuly send Email",
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

  //! NOTE: kode untuk view
  return (
    <>
      <Modal show={toggleModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Form Send Email</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row p-2">
              <div className="mb-3">
                <label htmlFor="namaTeknisi" className="form-label">
                  Email Teknis
                </label>
                 {/* NOTE : Input untuk email */}
                <input
                  readOnly
                  type="text"
                  name="email"
                  className="form-control"
                  value={data?.teknisi?.email}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="namaTeknisi" className="form-label">
                  Subject
                </label>
                 {/* NOTE : Input untuk subject */}
                <input
                  type="text"
                  name="ticket_keluhan"
                  className="form-control"
                  value={subject}
                  onChange={(e)=>setSubject(e.target.value)}
                />
                {error &&
                    validation?.subject?.map((msg, index) => (
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
                  Body
                </label>
                 {/* NOTE : Input untuk body */}
                <textarea
                  name="note"
                  className="form-control"
                  rows={5}
                  value={body}
                  onChange={(e)=>setBody(e.target.value)}
                ></textarea>
                {error &&
                    validation?.body?.map((msg, index) => (
                      <div
                        id="namaTeknisiHelp"
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
             {/* NOTE : tombol simpan */}
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
