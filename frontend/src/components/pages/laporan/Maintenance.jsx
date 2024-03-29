import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Pagging } from "../../datatable";
import { ExportToExcel } from "../../ExportToExcel";
import useHookAxios from "../../hook/useHookAxios";
import LoadingPage from "../../LoadingPage";
import Select from "../../Select";
import axios from "../../util/jsonApi";
import ToDate, { ConvertToEpoch } from "../../util/ToDate";

export default function Solved() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDateRange, endDateRange] = dateRange;
  const [startDate, setStartDate] = useState(new Date());
  const [type, setType] = useState({
    value: "1",
    label: "Bulan",
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    label: "10",
    value: 10,
  });

  const optionsType = [
    {
      value: "1",
      label: "Bulan",
    },
    {
      value: "2",
      label: "Tahun",
    },
    {
      value: "3",
      label: "Periode",
    },
  ];

  const [provinces, errorprovinces, loadingprovinces, provincesFunc] =
    useHookAxios();
  const [regencies, errorregencies, loadingregencies, regenciesFunc] =
    useHookAxios();
  const [districts, errordistricts, loadingdistricts, districtsFunc] =
    useHookAxios();
  const [villages, errorvillages, loadingvillages, villagesFunc] =
    useHookAxios();
  const [kategoris, errorKategoris, loadingKategoris, kategoriFunc] =
    useHookAxios();
  const [selectKategori, setSelectKategori] = useState({
    label: "SEMUA",
    value: "all",
  });
  const [selectProvinsi, setSelectProvinsi] = useState({
    label: "SEMUA",
    value: "all",
  });
  const [selectRegencies, setSelectRegencies] = useState({
    label: "SEMUA",
    value: "all",
  });
  const [selectDistrict, setSelectDistrict] = useState({
    label: "SEMUA",
    value: "all",
  });
  const [selectVillage, setSelectVillage] = useState({
    label: "SEMUA",
    value: "all",
  });
  const [response, error, loading, axiosFunc] = useHookAxios();
  const [dataExcel, setExcel] = useState([]);

  const getKategoris = () => {
    kategoriFunc({
      axiosInstance: axios,
      method: "GET",
      url: `kategori-report`,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  const getProvinces = () => {
    provincesFunc({
      axiosInstance: axios,
      method: "GET",
      url: `provinsi-report`,
      data: null,
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  const getKabupatenKota = () => {
    regenciesFunc({
      axiosInstance: axios,
      method: "GET",
      url: `kabkot-report`,
      data: null,
      reqConfig: {
        params: {
          provId: selectProvinsi?.value,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  const getKecamatan = () => {
    districtsFunc({
      axiosInstance: axios,
      method: "GET",
      url: `kecamatan-report`,
      data: null,
      reqConfig: {
        params: {
          regId: selectRegencies?.value,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  const getKelurahan = () => {
    villagesFunc({
      axiosInstance: axios,
      method: "GET",
      url: `kelurahan-report`,
      data: null,
      reqConfig: {
        params: {
          discId: selectDistrict?.value,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const invt = setTimeout(() => {
      getProvinces();
      getKategoris();
    }, 1);
    return () => clearInterval(invt);
  }, []);

  useEffect(() => {
    const inv =
      selectProvinsi.value !== "all" &&
      setTimeout(() => {
        getKabupatenKota();
        setSelectRegencies({ label: "SEMUA", value: "all" });
      }, 1);
    return () => clearInterval(inv);
  }, [selectProvinsi]);

  useEffect(() => {
    const inv =
      selectRegencies.value !== "all" &&
      setTimeout(() => {
        getKecamatan();
        setSelectDistrict({ label: "SEMUA", value: "all" });
      }, 1);
    return () => clearInterval(inv);
  }, [selectRegencies]);

  useEffect(() => {
    const inv =
      selectDistrict.value !== "all" &&
      setTimeout(() => {
        setSelectVillage({ label: "SEMUA", value: "all" });
        getKelurahan();
      }, 1);
    return () => clearInterval(inv);
  }, [selectDistrict]);

  const handleView = () => {
    let url = `maintenance-report?perpage=${pagination.value}&page=${page}&type=${type.value}`;
    if (type.value === "3") {
      let last = new Date(endDateRange);
      url += `&periode=${[
        ConvertToEpoch(startDateRange),
        ConvertToEpoch(last.setDate(last.getDate() + 1)),
      ]}`;
    } else if (type.value === "2") {
      const y = startDate.getFullYear();
      const m = startDate.getMonth();
      const first = new Date(y, 0, 1);
      const last = new Date(y, 11 + 1, 0);
      url += `&periode=${[ConvertToEpoch(first), ConvertToEpoch(last)]}`;
    } else {
      const y = startDate.getFullYear();
      const m = startDate.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      url += `&periode=${[ConvertToEpoch(first), ConvertToEpoch(last)]}`;
    }
    if (selectProvinsi.value !== "all") {
      url += `&provinsi=${selectProvinsi.value}`;
    }
    if (selectRegencies.value !== "all") {
      url += `&kabkot=${selectRegencies.value}`;
    }
    if (selectDistrict.value !== "all") {
      url += `&kecamatan=${selectDistrict.value}`;
    }
    if (selectVillage.value !== "all") {
      url += `&kelurahan=${selectVillage.value}`;
    }
    if (selectKategori.value !== "all") {
      url += `&kategori=${selectKategori.value}`;
    }
    axiosFunc({
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
    const inv = setTimeout(() => {
      setExcel([]);
      const status = response?.data ? "true" : "false";
      const dataExcel = [];
      status == "true" &&
        response.data.map((data) => {
          dataExcel.push({
            "Nomor Keluhan": data.keluhan.tiket,
            "Kategori Keluhan": data.keluhan.kategori.nama_kategori,
            Pelanggan: data.keluhan.pelanggan.nama_pelanggan,
            Dibuat: ToDate(parseInt(data.created_at), "full"),
            Status: data.status_desc,
            Ditangani: data.keluhan.pegawai.nama_pegawai,
            Provinsi:
              data.keluhan.pelanggan.kelurahan.kecamatan.kabkot.provinsi.name,
            "Kabupaten/Kota":
              data.keluhan.pelanggan.kelurahan.kecamatan.kabkot.name,
            Kecamatan: data.keluhan.pelanggan.kelurahan.kecamatan.name,
            Kelurahan: data.keluhan.pelanggan.kelurahan.name,
          });
        });
      setExcel(dataExcel);
    }, 1);
    return () => clearInterval(inv);
  }, [response]);

  useEffect(() => {
    const inv = setTimeout(() => {
      handleView();
    }, 1);

    return () => clearInterval(inv);
  }, []);

  useEffect(() => {
    handleView();
  }, [page]);

  //! NOTE: kode untuk view
  return (
    <div className="row bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Laporan Maintenance</h3>
        <div>
           {/* NOTE : Tombol lihat laporan */}
          <button className="btn btn-info" onClick={handleView}>
            <FontAwesomeIcon icon={faEye} />
            &nbsp; Lihat
          </button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="row m-2">
          <h5>Periode</h5>
           {/* NOTE : Input untuk periode */}
          <div className="col-12 col-xl-2">
            <Select
              options={optionsType}
              placeHolder={"Tipe"}
              getter={type}
              setter={setType}
            />
          </div>
          {type?.value === "1" && (
            <div className="col-12 col-xl-2">
              <DatePicker
                className="form-control"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
              />
            </div>
          )}
          {type?.value === "2" && (
            <div className="col-12 col-xl-2">
              <DatePicker
                className="form-control"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy"
                showMonthYearPicker
              />
            </div>
          )}
          {type?.value === "3" && (
            <div className="col-12 col-xl-3">
              <DatePicker
                className="form-control"
                selectsRange={true}
                startDate={startDateRange}
                endDate={endDateRange}
                onChange={(update) => {
                  setDateRange(update);
                }}
                withPortal
              />
            </div>
          )}
        </div>
        <div className="row m-2">
          <h5>Kategori</h5>
           {/* NOTE : Input untuk kategori */}
          <div className="col-12 col-xl-4">
            <Select
              options={kategoris}
              placeHolder={"Kategori"}
              getter={selectKategori}
              setter={setSelectKategori}
            />
          </div>
        </div>
        <div className="row m-2">
          <h5>Wilayah</h5>
           {/* NOTE : Input untuk wilayah */}
          <div className="col-12 col-xl-3">
            <div className="mb-3">
              <label htmlFor="provinsi" className="form-label">
                Provinsi
              </label>
              <Select
                options={provinces}
                placeHolder={"Provinsi"}
                getter={selectProvinsi}
                setter={setSelectProvinsi}
              />
            </div>
          </div>
          <div className="col-12 col-xl-3">
            <div className="mb-3">
              <label htmlFor="provinsi" className="form-label">
                Kabupaten / Kota
              </label>
              <Select
                options={regencies}
                placeHolder={"Kab/Kot"}
                getter={selectRegencies}
                setter={setSelectRegencies}
              />
            </div>
          </div>
          <div className="col-12 col-xl-3">
            <div className="mb-3">
              <label htmlFor="kecamatan" className="form-label">
                Kecamatan
              </label>
              <Select
                options={districts}
                placeHolder={"Kecamatan"}
                getter={selectDistrict}
                setter={setSelectDistrict}
              />
            </div>
          </div>
          <div className="col-12 col-xl-3">
            <div className="mb-3">
              <label htmlFor="kecamatan" className="form-label">
                Kelurahan
              </label>
              <Select
                options={villages}
                placeHolder={"Kelurahan"}
                getter={selectVillage}
                setter={setSelectVillage}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="px-3 py-2">
        {loading && <LoadingPage text={"Loading data"} />}
        {!loading && !error && (
          <>
            <div className="row mb-2 mt-2">
              <div className="col-12 d-flex flex-row-reverse">
                 {/* NOTE : Tombol Export */}
                <ExportToExcel
                  apiData={dataExcel}
                  fileName={`Maintenance-report-${ToDate(new Date())}`}
                />
              </div>
            </div>
             {/* NOTE : Tabel data */}
            <div className="table-responsive">
              <table className="table table-bordered text-nowrap">
                <thead className="bg-white text-center fw-bold">
                  <tr>
                    <th className="w-5">#</th>
                    <th>Nomor Keluhan</th>
                    <th>Kategori Keluhan</th>
                    <th>Pelanggan</th>
                    <th>Dibuat</th>
                    <th>Status</th>
                    <th>Ditangani</th>
                    <th>Provinsi</th>
                    <th>Kabupaten/Kota</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                  </tr>
                </thead>
                <tbody>
                  {response?.data ? (
                    response.data.length > 0 ? (
                      response.data.map((data, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {response.pagination.from + index}
                          </td>
                          <td>{data?.keluhan?.tiket}</td>
                          <td>{data?.keluhan?.kategori?.nama_kategori}</td>
                          <td>{data?.keluhan?.pelanggan?.nama_pelanggan}</td>
                          <td>{ToDate(parseInt(data.created_at), "full")}</td>
                          <td>{data?.status_desc}</td>
                          <td>{data?.keluhan?.pegawai?.nama_pegawai}</td>
                          <td>
                            {
                              data?.keluhan?.pelanggan?.kelurahan?.kecamatan
                                ?.kabkot?.provinsi?.name
                            }
                          </td>
                          <td>
                            {
                              data?.keluhan?.pelanggan?.kelurahan?.kecamatan
                                ?.kabkot?.name
                            }
                          </td>
                          <td>
                            {
                              data?.keluhan?.pelanggan?.kelurahan?.kecamatan
                                ?.name
                            }
                          </td>
                          <td>{data?.keluhan?.pelanggan?.kelurahan?.name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan={11}>Tidak Ada data</td>
                      </tr>
                    )
                  ) : (
                    <tr className="text-center">
                      <td colSpan={11}>Tidak Ada data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {response?.data ? (
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-12 col-xl-6">
                  show {response?.pagination.count} data of{" "}
                  {response?.pagination.total} data
                </div>
                <div className="col-12 col-xl-6 d-flex flex-row-reverse">
                  <div className="table-responsive">
                    <Pagging
                      total={response?.pagination.total}
                      itemsPerPage={response?.pagination.perPage}
                      currentPage={response?.pagination.currentPage}
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
