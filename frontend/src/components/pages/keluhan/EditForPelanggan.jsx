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

export default function KeluhanEditPelanggan() {
  const [pelanggan, errPelanggan, loadingPelanggan, pelFunc] = useHookAxios();
  const [kategori, errKategori, loadingKategori, katFunc] = useHookAxios();
  const [files, errFiles, loadingFiles, FilesFunc] = useHookAxios();
  const [selectPelanggan, setPelanggan] = useState(null);
  const [selectKategori, setKategori] = useState(null);
  const [state, dispatch] = useReducer(kelurahanReducer, INITIAL_STATE);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [fileHandle, setFileHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();
  const dataEdit = JSON.parse(atob(localStorage.getItem("dataEdit")));

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
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `keluhan/${state.id}`,
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
      navigasi(`${baseUrl}/keluhan`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  // edit
  const loadEdit = async () => {
    for (const key in dataEdit) {
      if (key === "comment") {
        dispatch({
          type: "CHANGE_INPUT",
          payload: {
            name: "komentar",
            value: dataEdit[key],
          },
        });
      } else {
        dispatch({
          type: "CHANGE_INPUT",
          payload: {
            name: key,
            value: dataEdit[key],
          },
        });
      }
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "_method",
          value: "PUT",
        },
      });
    }
    FilesFunc({
      axiosInstance: axios,
      method: "GET",
      url: `keluhan/files/${dataEdit.tiket}`,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
    setFileHandle(true);
  };

  useEffect(() => {
    const interval =
      fileHandle &&
      setTimeout(() => {
        dispatch({
          type: "CHANGE_INPUT",
          payload: {
            name: "_files",
            value: files,
          },
        });
      }, 1);
    return () => {
      clearInterval(interval);
    };
  }, [files]);

  useEffect(() => {
    const interval =
      fileHandle &&
      setTimeout(() => {
        state._files.length > 0 &&
          dispatch({
            type: "CHANGE_INPUT",
            payload: {
              name: "is_File",
              value: "true",
            },
          });
      }, 1);
    return () => {
      clearInterval(interval);
    };
  }, [state._files]);

  useEffect(() => {
    const interval = setTimeout(() => {
      loadEdit();
    }, 1);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const inv =
      pelanggan.length > 0 &&
      setTimeout(() => {
        const selected = pelanggan.filter(
          ({ value }) => value == dataEdit.pelanggan_id
        );
        setPelanggan(selected[0]);
      }, 1);
    return () => clearInterval(inv);
  }, [pelanggan]);

  useEffect(() => {
    const inv =
      kategori.length > 0 &&
      setTimeout(() => {
        const selected = kategori.filter(
          ({ value }) => value == dataEdit.kategori_id
        );
        setKategori(selected[0]);
      }, 1);
    return () => clearInterval(inv);
  }, [kategori]);

  return (
    <div className="row g-4">
      <div className="col-sm-12 col-xl-6 mx-0">
        <div className="bg-light rounded">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h3 className="pb-1 mb-0">Ubah Pengajuan Keluhan</h3>
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
                  // name="files"
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
      </div>
      <div className="col-sm-12 col-xl-6">
        <div className="bg-light rounded">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h3 className="mb-0">File</h3>
            <Link to={`${baseUrl}/keluhan`} className="btn btn-secondary mb-0">
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
          {!loadingFiles && !errFiles && files.length > 0 ? (
            <>
              <div className="row ms-2 p-2">
                <ul>
                  {fileHandle &&
                    files.map((file, index) => (
                      <li key={index}>
                        <a
                          target="_blank"
                          href={`${import.meta.env.VITE_FILE_PUBLIC}/file/${
                            file.file
                          }`}
                        >Lampiran {index+1}</a>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="row p-2">
                <p>Tidak Ada file</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
