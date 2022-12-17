import React, { useEffect, useRef, useState } from "react";
import axios from "../../util/jsonApi";
import LoadingPage from "../../LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { Search, Pagging } from "../../datatable";
import Select from "../../Select";
import { Link, useNavigate } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { baseUrl } from "../../util/BaseUrl";

export default function Pegawai() {
  const [pegawais, error, loading, axiosFuc] = useHookAxios();
  const [onSearch, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    label: "10",
    value: 10,
  });
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();

  const optionsPage = [
    {
      value: 10,
      label: "10",
    },
    {
      value: 25,
      label: "25",
    },
    {
      value: 50,
      label: "50",
    },
    {
      value: 100,
      label: "100",
    },
  ];

  const getPegawai = () => {
    let pageParse = page;
    let url = `pegawai?perpage=${pagination.value}`;
    if (onSearch) {
      pageParse = 1;
      url += `&page=${pageParse}&search=${onSearch}`;
    } else {
      url += `&page=${pageParse}`;
    }
    axiosFuc({
      axiosInstance: axios,
      method: "GET",
      url: url,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    getPegawai();
  }, [page, pagination]);

  const handleEditButton = (data) => {
    localStorage.setItem("dataEdit", btoa(JSON.stringify(data)));
    navigasi("edit", { replace: true });
  };

  const confirm = (id) => {
    confirmAlert({
      title: "Hapus Data",
      message: "Yakin melakukan ini.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setAxiosHandle(true);
            toastId.current = toast.loading("Please wait...");
            axiosFuc({
              axiosInstance: axios,
              method: "DELETE",
              url: `pegawai/${id}`,
              data: null,
              reqConfig: {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("auth")}`,
                },
              },
            });
          },
        },
        {
          label: "Cancel",
          onClick: () => false,
        },
      ],
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
        render: message.toString(),
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
      setAxiosHandle(false);
    }

    if (pegawais && !validation && !error && !loading) {
      toast.update(toastId.current, {
        render: "Successfuly deleted",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      getPegawai();
      setAxiosHandle(false);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [pegawais, error]);

  return (
    <div className="row bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Pegawai</h3>
        <Link to={`add`} className="btn btn-success mb-0">
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah
        </Link>
      </div>
      <div className="px-3 py-2">
        {loading && <LoadingPage text={"Loading data"} />}
        <div className="row mb-2 mt-2">
          <div className="col-md-2">
            <Select
              options={optionsPage}
              placeHolder={"Page"}
              getter={pagination}
              setter={setPagination}
            />
          </div>
          <div className="col-md-10 d-flex flex-row-reverse">
            <>
              <button className="btn btn-primary" onClick={() => getPegawai()}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
              &nbsp;
              <Search
                onSearch={(value) => {
                  setSearch(value);
                }}
              />
            </>
          </div>
        </div>
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered text-nowrap">
                <thead className="bg-white text-center fw-bold">
                  <tr>
                    <th className="w-5">#</th>
                    <th>Nama Pegawai</th>
                    <th>Email</th>
                    <th>Telepon</th>
                    <th>Jabatan</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pegawais?.data ? (
                    pegawais.data.length > 0 ? (
                      pegawais.data.map((data, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {pegawais.pagination.from + index}
                          </td>
                          <td>{data.nama_pegawai}</td>
                          <td>{data.email}</td>
                          <td>{data.telepon}</td>
                          <td>{data.role == '1' ? 'Admin' : data.role == '2' ? 'Helpdesk' : 'Teknisi' }</td>
                          <td>{data.alamat}</td>
                          <td className="text-center w-15">
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEditButton(data)}
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
                              &nbsp; Edit
                            </button>
                            &nbsp;
                            <button
                              className="btn btn-danger"
                              onClick={() => confirm(data.id)}
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                              &nbsp; Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan={7}>Tidak Ada data</td>
                      </tr>
                    )
                  ) : (
                    <tr className="text-center">
                      <td colSpan={7}>Tidak Ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {pegawais?.data ? (
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-12 col-xl-6">
                  show {pegawais?.pagination.count} data of{" "}
                  {pegawais?.pagination.total} data
                </div>
                <div className="col-12 col-xl-6 d-flex flex-row-reverse">
                  <Pagging
                    total={pegawais?.pagination.total}
                    itemsPerPage={pegawais?.pagination.perPage}
                    currentPage={pegawais?.pagination.currentPage}
                    onPageChange={(page) => setPage(page)}
                  />
                </div>
              </div>
            ) : (
              false
            )}
          </>
        )}
      </div>
    </div>
  )
}
