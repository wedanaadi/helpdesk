import React, { Suspense, useEffect, useRef, useState } from "react";
import axios from "../../util/jsonApi";
import LoadingPage from "../../LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faMessage,
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
import ToDate from "../../util/ToDate";
import SendEmail from "./SendEmail";

export default function Index() {
  const LocalUser = JSON.parse(localStorage.getItem("userData"));
  const hk = LocalUser.role;
  const [maintenances, error, loading, axiosFuc] = useHookAxios();
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

  const getMaintenance = () => {
    let pageParse = page;
    let url = `maintenance?perpage=${pagination.value}`;
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
        params: {
          role: LocalUser.role,
          idUser: LocalUser.idUser,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    getMaintenance();
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
              url: `maintenance/${id}`,
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

    if (maintenances && !validation && !error && !loading) {
      console.log("save");
      toast.update(toastId.current, {
        render: "Successfuly deleted",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      getMaintenance();
      setAxiosHandle(false);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [maintenances, error]);

  const handleDetail = (data) => {
    localStorage.setItem("detailMaintenance", JSON.stringify(data));
    navigasi("detail");
  };

  const [show, setShow] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  const handleModal = (data) => {
    setShow(true);
    setDataModal(data);
  };

  return (
    <div className="row bg-light rounded mx-0">
      <Suspense>
        <SendEmail
          toggleModal={show}
          setState={setShow}
          data={dataModal}
          type="toTeknisi"
        />
      </Suspense>
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Data Maintenance</h3>
        {hk == "1" ||
          hk == "2" ||
          (hk == "5" && (
            <Link to={`add`} className="btn btn-success mb-0">
              <FontAwesomeIcon icon={faPlus} />
              &nbsp; Tambah
            </Link>
          ))}
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
              <button
                className="btn btn-primary"
                onClick={() => getMaintenance()}
              >
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
                    <th>Tiket Maintenance</th>
                    {/* <th>Teknisi</th> */}
                    {/* <th>Tiket Keluhan</th> */}
                    <th>Dibuat</th>
                    <th>Masa Berlaku</th>
                    <th>Status</th>
                    {/* <th>Note</th> */}
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenances?.data ? (
                    maintenances.data.length > 0 ? (
                      maintenances.data.map((data, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {maintenances.pagination.from + index}
                          </td>
                          <td>{data.tiket_maintenance}</td>
                          {/* <td>{data.teknisi.nama_pegawai}</td> */}
                          {/* <td>{data.tiket_keluhan}</td> */}
                          <td>{ToDate(data.created_at, "full")}</td>
                          <td>{ToDate(data.expired_date, "full")}</td>
                          <td>{data.status_desc}</td>
                          {/* <td>{data.note}</td> */}
                          <td className="text-center w-15">
                            {LocalUser.role != "3" && (
                              <>
                                <button
                                  className="btn btn-info mb-0"
                                  onClick={() => handleModal(data)}
                                >
                                  <FontAwesomeIcon icon={faEnvelope} />
                                  &nbsp; Send Email
                                </button>
                                &nbsp;
                              </>
                            )}
                            <button
                              onClick={() => handleDetail(data)}
                              className="btn btn-success mb-0"
                            >
                              <FontAwesomeIcon icon={faSearch} />
                              &nbsp; Detail
                            </button>
                            {LocalUser.role != "3" && data.status != "1" && (
                              <>
                                &nbsp;
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
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan={10}>Tidak Ada data</td>
                      </tr>
                    )
                  ) : (
                    <tr className="text-center">
                      <td colSpan={10}>Tidak Ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {maintenances?.data ? (
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-12 col-xl-6">
                  show {maintenances?.pagination.count} data of{" "}
                  {maintenances?.pagination.total} data
                </div>
                <div className="col-12 col-xl-6 d-flex flex-row-reverse">
                  <Pagging
                    total={maintenances?.pagination.total}
                    itemsPerPage={maintenances?.pagination.perPage}
                    currentPage={maintenances?.pagination.currentPage}
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
  );
}
