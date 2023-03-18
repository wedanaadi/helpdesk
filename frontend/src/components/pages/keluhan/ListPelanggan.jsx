import { faEye, faFileExcel, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagging, Search } from "../../datatable";
import useHookAxios from "../../hook/useHookAxios";
import LoadingPage from "../../LoadingPage";
import Select from "../../Select";
import axios from "../../util/jsonApi";
const ImportComponent = React.lazy(() => import("./modalImportKeluhan"));

export default function ListPelanggan() {
  const [keluhans, error, loading, axiosFuc] = useHookAxios();
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

  const getKeluhan = () => {
    let pageParse = page;
    let url = `list-pelanggan?perpage=${pagination.value}`;
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
    getKeluhan();
  }, [page, pagination]);

  const handleTicket = (data) => {
    localStorage.setItem("pelangganKeluhan", btoa(data));
    navigasi("listTicket");
  };

  const [showImportComponent, setShowImportComponent] = useState(false);

  return (
    <div className="row bg-light mx-0 rounded">
      <ImportComponent
        toogleShow={showImportComponent}
        setClose={setShowImportComponent}
        reloadData={() => getKeluhan()}
      />
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">List Keluhan Pelanggan</h3>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setShowImportComponent(true)}
          >
            <FontAwesomeIcon icon={faFileExcel} />
            &nbsp; Import
          </button>
          &nbsp;
          <Link to={`add`} className="btn btn-success mb-0">
            <FontAwesomeIcon icon={faPlus} />
            &nbsp; Tambah
          </Link>
        </div>
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
              <button className="btn btn-primary" onClick={() => getKeluhan()}>
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
      </div>
      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-bordered text-nowrap">
              <thead className="bg-white text-center fw-bold">
                <tr>
                  <th className="w-5">#</th>
                  <th>ID Pelanggan</th>
                  <th>Nama Pelanggan</th>
                  <th>Ticket Keluhan</th>
                </tr>
              </thead>
              <tbody>
                {keluhans?.data?.length > 0 ? (
                  keluhans.data.map((row, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {keluhans.pagination.from + index}
                      </td>
                      <td>{row.pelanggan.id}</td>
                      <td>{row.pelanggan.nama_pelanggan}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleTicket(row.pelanggan.id)}
                          className="btn btn-info mb-0"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          &nbsp; Lihat Ticket
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={10}>Tidak Ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {keluhans?.data ? (
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col-12 col-xl-6">
                show {keluhans?.pagination.count} data of{" "}
                {keluhans?.pagination.total} data
              </div>
              <div className="col-12 col-xl-6 d-flex flex-row-reverse">
                <div className="table-responsive">
                  <Pagging
                    total={keluhans?.pagination.total}
                    itemsPerPage={keluhans?.pagination.perPage}
                    currentPage={keluhans?.pagination.currentPage}
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
  );
}
