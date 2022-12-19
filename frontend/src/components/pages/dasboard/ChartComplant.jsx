import LineChart1 from "../../LineChart";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import useHookAxios from "../../hook/useHookAxios";
import Select from "../../Select";
import axios from "../../util/jsonApi";
import { ConvertToEpoch } from "../../util/ToDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

export default function ChartComplaint() {
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
  const [solved, error, loading, solvedAxios] = useHookAxios();
  const [maintenance, errormaintenance, loadingmaintenance, maintenanceAxios] =
    useHookAxios();

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
      handleView()
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
    setShowChartSolved(false);
    let url = `complaint-chart?type=${type.value}`;
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
      const last = new Date(y, 11 + 1, 1);
      url += `&periode=${[ConvertToEpoch(first), ConvertToEpoch(last)]}`;
    } else {
      const y = startDate.getFullYear();
      const m = startDate.getMonth();
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 1);
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
    solvedAxios({
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
    setShowChartSolved(true);
  };

  const [showChartSolved, setShowChartSolved] = useState(false);
  return (
    <div className="row bg-light rounded mx-0 mb-4">
      <div className="mb-3 col-12 mb-4">
        <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
          <h3 className="mb-0">Grafik Complaint</h3>
          <div>
            <button className="btn btn-info" onClick={handleView}>
              <FontAwesomeIcon icon={faSync} />
              &nbsp; Proses
            </button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="row m-2">
            <h5>Periode</h5>
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
            <h5>Wilayah</h5>
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
        {showChartSolved && (
          <div className="col-md-12">
            <LineChart1 dataMentah={solved} />
          </div>
        )}
      </div>
      {/* ss */}
    </div>
  );
}
