import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import useHookAxios from "../hook/useHookAxios";
import axios from "../util/jsonApi"

export default function Setting({ toggleModal, setState, data }) {
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const [response, error, loading, actionAxios] = useHookAxios();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleClose = () => {
    setState(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    actionAxios({
      axiosInstance: axios,
      method: "POST",
      url: `updateUserLogin`,
      data: {
        username,password,
        idLogin: data
      },
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  }

  const handleAxios = () => {
    let message = "Error";
    if (!loading && error) {
      toast.update(toastId.current, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
    }

    if (response && !error && !loading) {
      handleClose()
      toast.update(toastId.current, {
        render: "Successfuly updated data login",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      setUsername("")
      setPassword("")
      setAxiosHandle(false);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <>
      <Modal show={toggleModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ubah Username dan Password</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row p-2">
              <div className="mb-3">
                <label htmlFor="namaTeknisi" className="form-label">
                  Username
                </label>
                <input type="text" className="form-control" onChange={(e)=>setUsername(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="namaTeknisi" className="form-label">
                  Password
                </label>
                <input type="password" className="form-control" onChange={(e)=>setPassword(e.target.value)} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary">
              Update Data
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
