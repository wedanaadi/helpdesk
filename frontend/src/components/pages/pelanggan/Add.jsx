import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useReducer, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import Select from "../../Select";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";
import Map from "../../Map";
import {
  INITIAL_STATE,
  pelangganReducer,
} from "../../reducer/pelangganReducer";
import { toast } from "react-toastify";

export default function Add() {
  const [provinces, errorprovinces, loadingprovinces, provincesFunc] =
    useHookAxios();
  const [regencies, errorregencies, loadingregencies, regenciesFunc] =
    useHookAxios();
  const [districts, errordistricts, loadingdistricts, districtsFunc] =
    useHookAxios();
  const [villages, errorvillages, loadingvillages, villagesFunc] =
    useHookAxios();
  const [selectProvinsi, setSelectProvinsi] = useState(null);
  const [selectRegencies, setSelectRegencies] = useState(null);
  const [selectDistrict, setSelectDistrict] = useState(null);
  const [selectVillage, setSelectVillage] = useState(null);
  const [mapDetect, setMapDetect] = useState(false);
  const [state, dispatch] = useReducer(pelangganReducer, INITIAL_STATE);
  const [validation, setValidation] = useState(null);
  const toastId = useRef(null);
  const navigasi = useNavigate();
  const [axiosHandle, setAxiosHandle] = useState(false);
  const [response, error, loading, AxiosFuc] = useHookAxios();

  const getProvinces = () => {
    provincesFunc({
      axiosInstance: axios,
      method: "GET",
      url: `provinsi`,
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
      url: `kabkot`,
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
      url: `kecamatan`,
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
      url: `kelurahan`,
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
    const inv = setTimeout(() => {
      getProvinces();
    }, 1);
    return () => clearInterval(inv);
  }, []);

  useEffect(() => {
    const inv = setTimeout(() => {
      getKabupatenKota();
      setSelectRegencies(null);
    }, 1);
    return () => clearInterval(inv);
  }, [selectProvinsi]);

  useEffect(() => {
    const inv = setTimeout(() => {
      getKecamatan();
      setSelectDistrict(null);
    }, 1);
    return () => clearInterval(inv);
  }, [selectRegencies]);

  useEffect(() => {
    const inv = setTimeout(() => {
      setSelectVillage(null);
      getKelurahan();
    }, 1);
    return () => clearInterval(inv);
  }, [selectDistrict]);

  // dispatch data
  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  useEffect(() => {
    const Inv = setTimeout(() => {
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "provinsi",
          value: selectProvinsi?.value ? selectProvinsi?.value : "",
        },
      });
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "kabkot",
          value: selectRegencies?.value ? selectRegencies?.value : "",
        },
      });
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "kecamatan",
          value: selectDistrict?.value ? selectDistrict?.value : "",
        },
      });
      dispatch({
        type: "CHANGE_INPUT",
        payload: {
          name: "kelurahan",
          value: selectVillage?.value ? selectVillage?.value : "",
        },
      });
    }, 1);
    return () => {
      clearInterval(Inv);
    };
  }, [selectProvinsi, selectDistrict, selectRegencies, selectVillage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    AxiosFuc({
      axiosInstance: axios,
      method: "POST",
      url: `pelanggan`,
      data: state,
      reqConfig: {
        headers: {
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
        render: message.toString(),
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
      navigasi(`${baseUrl}/pelanggan`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <div className="row col-12 bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Tambah Pelanggan</h3>
        <Link to={`${baseUrl}/pelanggan`} className="btn btn-secondary mb-0">
          <FontAwesomeIcon icon={faArrowLeft} />
          &nbsp; Kembali
        </Link>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off" className="px-0">
        <div className="row p-2">
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="namaPegawai" className="form-label">
                Nama Pelanggan
              </label>
              <input
                type="text"
                name="nama_pelanggan"
                className="form-control"
                id="namaPegawai"
                aria-describedby="namaPegawaiHelp"
                onChange={handleChange}
                value={state.nama_pelanggan}
              />
              {error &&
                validation?.nama_pelanggan?.map((msg, index) => (
                  <div
                    id="namaPegawaiHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                onChange={handleChange}
                value={state.email}
              />
              {error &&
                validation?.email?.map((msg, index) => (
                  <div
                    id="emailHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="telepon" className="form-label">
                Telepon
              </label>
              <input
                type="text"
                name="telepon"
                className="form-control"
                id="telepon"
                aria-describedby="teleponHelp"
                onChange={handleChange}
                value={state.telepon}
              />
              {error &&
                validation?.telepon?.map((msg, index) => (
                  <div
                    id="teleponHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
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
                classCustom={"zi-100000"}
              />
              {error &&
                validation?.provinsi?.map((msg, index) => (
                  <div
                    id="provinsiHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
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
                classCustom={"zi-100000"}
              />
              {error &&
                validation?.provinsi?.map((msg, index) => (
                  <div
                    id="provinsiHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
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
                classCustom={"zi-100000"}
              />
              {error &&
                validation?.provinsi?.map((msg, index) => (
                  <div
                    id="provinsiHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
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
                classCustom={"zi-100000"}
              />
              {error &&
                validation?.provinsi?.map((msg, index) => (
                  <div
                    id="provinsiHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="mb-3">
              <label htmlFor="alamat" className="form-label">
                Alamat
              </label>
              <textarea
                name="alamat"
                id="alamat"
                className="form-control"
                rows={10}
                value={state.alamat}
                onChange={handleChange}
              ></textarea>
              {error &&
                validation?.alamat?.map((msg, index) => (
                  <div
                    id="alamatHelp"
                    className="form-text text-danger"
                    key={index}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 col-xl-8">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="alamat" className="form-label">
                  Kordinat{" "}
                  <span className="text-danger">
                    *Klik Peta untuk memperbaharui kordinat
                  </span>
                </label>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => setMapDetect(!mapDetect)}
                >
                  {!mapDetect ? "Manual Deteksi" : "Deteksi dari Internet"}
                </button>
              </div>
              <Map aksi={mapDetect} statePosition={dispatch} />
              {(error && validation?.lat) || (error && validation?.long) ? (
                <div id="alamatHelp" className="form-text text-danger">
                  Kordinat Harus Diisi!
                </div>
              ) : (
                false
              )}
            </div>
          </div>
        </div>
        <div className="py-3 px-2 border-top d-flex flex-row-reverse">
          <button type="submit" className="btn btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
