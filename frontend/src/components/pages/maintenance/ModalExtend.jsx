import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useHookAxios from '../../hook/useHookAxios';
import ToDate, { ConvertToEpoch } from '../../util/ToDate';
import axios from "../../util/jsonApi";
import { toast } from 'react-toastify';
import { baseUrl } from '../../util/BaseUrl';

export default function ModalExtend({ toogleShow, setClose, dataDetail }) {
  const curr_exp = new Date(dataDetail.expired_date);
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const [file, setFile] = useState(null);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [addDate, setAddDate] = useState(1)
  
  const handleClose = () => {
    setClose(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(addDate==null || addDate=="") {
      alert('Data tidak Valid');
      return false;
    }
    let newexp = curr_exp.setDate(curr_exp.getDate() + parseInt(addDate));
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "PUT",
      url: `maintenance/expired/${dataDetail.id}`,
      data: {newExpDate:newexp},
      reqConfig: {
        headers: {
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
        <Modal.Title>Perpanjang Expired Date</Modal.Title>
      </Modal.Header>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row p-2">
            <div className="mb-3">
              <label htmlFor="extendDate" className="form-label">
                Lama Hari
              </label>
              <input
                type="number"
                name="extendDate"
                className="form-control"
                min="1"
                onChange={(e)=>setAddDate(e.target.value)}
                value={addDate}
              />
              {/* {error &&
                validation?.file?.map((msg, index) => (
                  <div
                    id="errorText"
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
            Simpan
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  </>
  )
}
