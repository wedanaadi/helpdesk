import {
  faArrowLeft,
  faCheckDouble,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useHookAxios from "../../hook/useHookAxios";
import Map2 from "../../Map2";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";
import ToDate from "../../util/ToDate";
const ModalMaintenance = React.lazy(() =>
  import("../../pages/maintenance/Add")
);

export default function Detail() {
  const detailLokal = JSON.parse(localStorage.getItem("detailKeluhan"));
  const [mapDetect, setMapDetect] = useState(false);
  const [logs, errorlogs, loadinglogs, logsAxios] = useHookAxios();
  const [response, error, loading, actionAxios] = useHookAxios();
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
  const hk = LokalUser.role;

  const handleSolve = () => {
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    actionAxios({
      axiosInstance: axios,
      method: "PUT",
      url: `keluhan/status/${detailLokal.id}`,
      data: { status: "1" },
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
    setAxiosHandle(true);
  };

  const handleAxios = () => {
    let message = "Error";
    setValidation(null);
    if (!loading && error) {
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
        render: "Successfuly updated Status",
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

  const getLogs = () => {
    logsAxios({
      axiosInstance: axios,
      method: "GET",
      url: `log-keluhan`,
      data: null,
      reqConfig: {
        params: {
          idKeluhan: detailLokal.tiket,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const invt = setTimeout(() => {
      getLogs();
    }, 1);
    return () => clearInterval(invt);
  }, []);

  return (
    <div className="row g-4">
      <Suspense fallback={<>Loading....</>}>
        <ModalMaintenance ticket={detailLokal.tiket} />
      </Suspense>
      <div className="col-12 mx-0">
        <div className="bg-light rounded">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h3 className="pb-1 mb-0">Detail Ticket Keluhan</h3>
            {hk == "4" ? (
              <Link
                to={`${baseUrl}/keluhan/pelanggan`}
                className="btn btn-secondary mb-0"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Kembali
              </Link>
            ) : (
              <Link
                to={`${baseUrl}/keluhan`}
                className="btn btn-secondary mb-0"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Kembali
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="col-12 mx-0">
        <div className="row p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              NOMOR: <b>{detailLokal.tiket}</b> - STATUS:{" "}
              <b>{detailLokal.status_keluhan}</b> <br />
              EXPIRED DATE TICKET:{" "}
              <b>{ToDate(detailLokal.expired_date, "full")}</b>
            </div>
            {hk == "4" ? (
              false
            ) : (
              <>
                <div>
                  {detailLokal.status === 0 &&
                  detailLokal.status_keluhan === "ON" ? (
                    <>
                      <button className="btn btn-success" onClick={handleSolve}>
                        <FontAwesomeIcon icon={faCheckDouble} />
                        &nbsp; Ubah Status menjadi Solve
                      </button>{" "}
                      &nbsp;{" "}
                      <button
                        className="btn btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#commentModal"
                      >
                        <FontAwesomeIcon icon={faWrench} />
                        &nbsp; Tambahkan ke Maintenance
                      </button>
                    </>
                  ) : (
                    false
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-6 mx-0">
        <div className="bg-light rounded">
          <div className="row pb-2 mx-0">
            <div className="border-bottom">
              <div className="fw-bold p-2">Detail Pelapor</div>
            </div>
            <div className="mt-3">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Nama Pelanggan</td>
                    <td>:</td>
                    <td>{detailLokal.pelanggan.nama_pelanggan}</td>
                  </tr>
                  <tr>
                    <td>Telepon</td>
                    <td>:</td>
                    <td>{detailLokal.pelanggan.telepon}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>{detailLokal.pelanggan.email}</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>
                      <b>{detailLokal.pelanggan.alamat}</b>, Kelurahan{" "}
                      <b>{detailLokal.pelanggan.kelurahan.name}</b>, Kecamatan{" "}
                      <b> {detailLokal.pelanggan.kelurahan.kecamatan.name}</b>,
                      Kabupaten{" "}
                      <b>
                        {detailLokal.pelanggan.kelurahan.kecamatan.kabkot.name}
                      </b>
                      , Provinsi{" "}
                      <b>
                        {
                          detailLokal.pelanggan.kelurahan.kecamatan.kabkot
                            .provinsi.name
                        }
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-6 mx-0">
        <div className="bg-light rounded">
          <div className="row pb-2 mx-0">
            <div className="border-bottom">
              <div className="fw-bold p-2">Detail Keluahan</div>
            </div>
            <div className="mt-3">
              <table className="table">
                <tbody>
                  <tr>
                    <td>Keluhan Text / Deskripsi</td>
                    <td>:</td>
                    <td>
                      <p style={{ whiteSpace: "pre-line" }}>
                        <b>{detailLokal.comment}</b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>File</td>
                    <td>:</td>
                    <td>
                      {detailLokal.files.length > 0 ? (
                        <>
                          <ul>
                            {detailLokal.files.map((file, index) => (
                              <div key={index}>
                                <li>
                                  <a
                                    target="_blank"
                                    href={`${
                                      import.meta.env.VITE_FILE_PUBLIC
                                    }/file/${file.file}`}
                                  >
                                    Lampiran {index + 1}
                                  </a>
                                </li>
                              </div>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <>Tidak ada file</>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 mx-0">
        <div className="bg-light rounded">
          <div className="p-3 border-bottom">
            <h5>Detail Kordinat</h5>
          </div>
          <div className="p-3 border-bottom">
            <Map2
              aksi={mapDetect}
              stateProps={{
                lat: detailLokal.pelanggan.lat,
                lng: detailLokal.pelanggan.long,
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-12 mx-0">
        <div className="bg-light rounded">
          <div className="p-3 border-bottom">
            <h5>Riwayat Penanganan</h5>
          </div>
          <div className="p-3 border-bottom">
            <section className="py-2">
              <ul className="timeline">
                {logs.length > 0 &&
                  logs.map((log, index) => (
                    <div key={index}>
                      <li className="timeline-item mb-5">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="fw-bold">{log.deskripsi}</h5>
                        </div>
                        <p className="text-muted mb-2 fw-bold">
                          {ToDate(log.created_at, "full")}
                        </p>
                      </li>
                    </div>
                  ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
