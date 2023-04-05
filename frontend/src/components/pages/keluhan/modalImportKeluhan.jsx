import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHookAxios from "../../hook/useHookAxios";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";

export default function modalImportKeluhan({ toogleShow, setClose, reloadData }) {
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();

  const handleClose = () => {
    setClose(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `import/keluhan`,
      data: {
        file,
      },
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
          Accept: `application/json`,
          "Content-Type": "multipart/form-data",
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
        render: "Successfuly Import Data...",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
      reloadData();
      // navigasi(`${baseUrl}/keluhan`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  //! NOTE: kode untuk view
  return (
    <>
      <Modal show={toogleShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Import Excel</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row p-2">
              <div className="mb-3">
                <label htmlFor="namaTeknisi" className="form-label">
                  File Excel
                </label>
                 {/* NOTE : Input untuk file */}
                <input
                  type="file"
                  name="fileImport"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {error &&
                  validation?.file?.map((msg, index) => (
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
             {/* NOTE : Tombol Import */}
            <Button type="submit" variant="primary">
              Import Excel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
