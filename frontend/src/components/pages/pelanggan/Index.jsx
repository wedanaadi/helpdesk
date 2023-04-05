import React, { Suspense, useEffect, useRef, useState } from "react";
import axios from "../../util/jsonApi";
import LoadingPage from "../../LoadingPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faFileExcel,
  faPencilAlt,
  faPlus,
  faSearch,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Search, Pagging } from "../../datatable";
import Select from "../../Select";
import { Link, useNavigate } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { baseUrl } from "../../util/BaseUrl";
import SendEmail from "./SendEmail";
const ImportComponent = React.lazy(() => import("./modalImport"));

export default function Index() {
  const UserLogin = JSON.parse(localStorage.getItem("userData"));
  const [pelanggans, error, loading, axiosFuc] = useHookAxios();
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
  const LocalUser = JSON.parse(localStorage.getItem("userData"));
  const hk = LocalUser.role;

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

  const getPelanggan = () => {
    let pageParse = page;
    let url = `pelanggan?perpage=${pagination.value}`;
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
    getPelanggan();
  }, [page, pagination]);

  const handleEditButton = (data) => {
    localStorage.setItem("dataEdit", btoa(JSON.stringify(data)));
    navigasi("edit", { replace: true });
  };

  const confirm = (id, value) => {
    confirmAlert({
      title: `${value===0?'Non-Aktifkan':'Aktifkan'} Pelanggan`,
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
              url: `pelanggan/${id}`,
              data: null,
              reqConfig: {
                params: {
                  value
                },
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

    if (pelanggans && !validation && !error && !loading) {
      toast.update(toastId.current, {
        render: "Successfuly...",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      getPelanggan();
      setAxiosHandle(false);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [pelanggans, error]);

  const handleKeluhanButton = (data) => {
    localStorage.setItem("dataAddKeluhan", btoa(JSON.stringify(data)));
    navigasi(`${baseUrl}/keluhan/addSystem`, { replace: true });
  };

  const [show, setShow] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  const handleModal = (data) => {
    setShow(true);
    setDataModal(data);
  };

  const [showImportComponent, setShowImportComponent] = useState(false);

  return (
    <div className="row bg-light rounded mx-0">
      <Suspense>
        <>
          <SendEmail
            toggleModal={show}
            setState={setShow}
            data={dataModal}
            type="toTeknisi"
          />
          <ImportComponent
            toogleShow={showImportComponent}
            setClose={setShowImportComponent}
            reloadData={()=>getPelanggan()}
          />
        </>
      </Suspense>
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Pelanggan</h3>
        {UserLogin.role == "1" ? (
          <div className="mb-0">
             {/* NOTE : Tombol Import Data */}
            <button className="btn btn-success" onClick={()=> setShowImportComponent(true)}>
              <FontAwesomeIcon icon={faFileExcel} />
              &nbsp; Import
            </button>
            &nbsp;
             {/* NOTE : Tombol Tambah data */}
            <Link to={`add`} className="btn btn-success">
              <FontAwesomeIcon icon={faPlus} />
              &nbsp; Tambah
            </Link>
          </div>
        ) : (
          false
        )}
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
           {/* NOTE : Input untuk search */}
          <div className="col-md-10 d-flex flex-row-reverse">
            <>
              <button
                className="btn btn-primary"
                onClick={() => getPelanggan()}
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
         {/* NOTE : Tabel data */}
        {!loading && !error && (
          <>
            <div className="table-responsive">
              <table className="table table-bordered text-nowrap">
                <thead className="bg-white text-center fw-bold">
                  <tr>
                    <th>Keluhan</th>
                    <th className="w-5">ID Pelanggan</th>
                    <th>Nama Pelanggan</th>
                    <th>Email</th>
                    <th>Telepon</th>
                    <th>Alamat</th>
                    <th>Provinsi</th>
                    <th>Kabupaten/Kota</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Status</th>
                    {UserLogin.role == "1" ? <th>Aksi</th> : false}
                  </tr>
                </thead>
                <tbody>
                  {pelanggans?.data ? (
                    pelanggans.data.length > 0 ? (
                      pelanggans.data.map((data, index) => (
                        <tr key={index}>
                          <td>
                            <button
                              className="btn btn-success"
                              onClick={() => handleKeluhanButton(data)}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                              &nbsp; Tambah
                            </button>
                          </td>
                          {/* <td className="text-center">
                            {pelanggans.pagination.from + index}
                          </td> */}
                          <td>{data.id}</td>
                          <td>{data.nama_pelanggan}</td>
                          <td>
                            <div className="d-flex justify-content-between mx-0">
                              <span>{data.email}</span>
                              &nbsp;
                               {/* NOTE : Tombol kirim email */}
                              <button
                                className="btn btn-info mb-0"
                                onClick={() => handleModal(data)}
                              >
                                <FontAwesomeIcon icon={faEnvelope} />
                                &nbsp; Kirim
                              </button>
                              &nbsp;
                            </div>
                          </td>
                          <td>{data.telepon}</td>
                          <td>{data.alamat}</td>
                          <td>
                            {data.kelurahan?.kecamatan?.kabkot?.provinsi?.name}
                          </td>
                          <td>{data.kelurahan?.kecamatan?.kabkot?.name}</td>
                          <td>{data.kelurahan?.kecamatan?.name}</td>
                          <td>{data.kelurahan?.name}</td>
                          <td>{data?.is_aktif === 1 ? 'Aktif' : 'Non-Aktif'}</td>
                          {UserLogin.role == "1" ? (
                            <>
                              <td className="text-center w-15">
                                 {/* NOTE : Tombol edit */}
                                <button
                                  className="btn btn-warning"
                                  onClick={() => handleEditButton(data)}
                                >
                                  <FontAwesomeIcon icon={faPencilAlt} />
                                  &nbsp; Edit
                                </button>
                                &nbsp;
                                 {/* NOTE : Tombol aktif / non aktif */}
                                {data?.is_aktif === 1 ? (
                                <button
                                  className="btn btn-danger"
                                  onClick={() => confirm(data.id, 0)}
                                >
                                  <FontAwesomeIcon icon={faXmarkCircle} />
                                  &nbsp; Non-Aktifkan
                                </button>) : (<button
                                  className="btn btn-success"
                                  onClick={() => confirm(data.id, 1)}
                                >
                                  <FontAwesomeIcon icon={faXmarkCircle} />
                                  &nbsp; Aktifkan
                                </button>)} 
                              </td>
                            </>
                          ) : (
                            false
                          )}
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
            {pelanggans?.data ? (
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-12 col-xl-6">
                  show {pelanggans?.pagination.count} data of{" "}
                  {pelanggans?.pagination.total} data
                </div>
                <div className="col-12 col-xl-6 d-flex flex-row-reverse">
                  <div className="table-responsive">
                    <Pagging
                      total={pelanggans?.pagination.total}
                      itemsPerPage={pelanggans?.pagination.perPage}
                      currentPage={pelanggans?.pagination.currentPage}
                      onPageChange={(page) => setPage(page)}
                    />
                  </div>
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
