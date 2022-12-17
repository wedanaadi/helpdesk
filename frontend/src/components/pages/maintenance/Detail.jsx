import {
  faArrowLeft,
  faCheckDouble,
  faClock,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import Map2 from "../../Map2";
import { baseUrl } from "../../util/BaseUrl";
import ToDate, { ConvertToEpoch } from "../../util/ToDate";
import axios from "../../util/jsonApi"
import { toast } from "react-toastify";

export default function DetailMaintenance() {
  const detailLokal = JSON.parse(localStorage.getItem("detailMaintenance"));
  const lokalUser = JSON.parse(localStorage.getItem('userData'));
  const [mapDetect, setMapDetect] = useState(false);
  const [response, error, loading, axiosFunction] = useHookAxios()
  const [axiosHandle, setAxiosHandle] = useState(false);
  const toastId = useRef(null);
  const [validation, setValidation] = useState(null);
  const navigasi = useNavigate();

  const checkExp = () => {
    const db = ConvertToEpoch(detailLokal.expired_date);
    const now = ConvertToEpoch(new Date());
    return db < now ? false : true;
  };

  const handlePenanganan = (status) => {
    setAxiosHandle(true);
    toastId.current = toast.loading("Please wait...");
    axiosFunction({
      axiosInstance: axios,
      method: "PUT",
      url: `maintenance/status/${detailLokal.id}`,
      data: { status: status },
      reqConfig: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
    setAxiosHandle(true);
  }

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
      navigasi(`${baseUrl}/maintenance`);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return (
    <div className="row g-4">
      <div className="col-12 mx-0">
        <div className="bg-light rounded">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h3 className="pb-1 mb-0">Detail Ticket Maintenance</h3>
            <Link
              to={`${baseUrl}/maintenance`}
              className="btn btn-secondary mb-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
        </div>
      </div>
      <div className="col-12 mx-0">
        <div className="row p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              NOMOR: <b>{detailLokal.tiket_maintenance}</b> - STATUS:{" "}
              <b>{detailLokal.status_desc}</b> <br />
              EXPIRED DATE TICKET:{" "}
              <b>{ToDate(detailLokal.expired_date, "full")}</b><br/>
              Ditangani oleh : <b>{detailLokal.teknisi.nama_pegawai}</b>
            </div>
            <div>
              {parseInt(detailLokal.status) !== 1 && checkExp() && lokalUser.role == '3' ? (
                <>
                  <span>Update Ticket: </span>&nbsp;
                  <button className="btn btn-success" onClick={()=>handlePenanganan('1')}>
                    <FontAwesomeIcon icon={faCheckDouble} />
                    &nbsp; Solved
                  </button>{" "}
                  &nbsp;{" "}
                  {parseInt(detailLokal.status) !== 2 ? (
                    <button
                      className="btn btn-warning"
                      onClick={()=>handlePenanganan('2')}
                    >
                      <FontAwesomeIcon icon={faClock} />
                      &nbsp; Pending
                    </button>
                  ) : (
                    false
                  )}
                </>
              ) : (
                false
              )}
            </div>
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
                    <td>{detailLokal.keluhans.pelanggan.nama_pelanggan}</td>
                  </tr>
                  <tr>
                    <td>Telepon</td>
                    <td>:</td>
                    <td>{detailLokal.keluhans.pelanggan.telepon}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>{detailLokal.keluhans.pelanggan.email}</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>
                      <b>{detailLokal.keluhans.pelanggan.alamat}</b>, Kelurahan{" "}
                      <b>{detailLokal.keluhans.pelanggan.kelurahan.name}</b>,
                      Kecamatan{" "}
                      <b>
                        {" "}
                        {detailLokal.keluhans.pelanggan.kelurahan.kecamatan.name}
                      </b>
                      , Kabupaten{" "}
                      <b>
                        {
                          detailLokal.keluhans.pelanggan.kelurahan.kecamatan
                            .kabkot.name
                        }
                      </b>
                      , Provinsi{" "}
                      <b>
                        {
                          detailLokal.keluhans.pelanggan.kelurahan.kecamatan
                            .kabkot.provinsi.name
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
                    <td>Nomor Ticket</td>
                    <td>:</td>
                    <td>
                      <b>{detailLokal.keluhans.tiket}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Dibuat</td>
                    <td>:</td>
                    <td>
                      <b>{ToDate(detailLokal.keluhans.created_at, "full")}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Keluhan Text / Deskripsi</td>
                    <td>:</td>
                    <td>
                      <p style={{ whiteSpace: "pre-line" }}>
                        <b>{detailLokal.keluhans.comment}</b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>File</td>
                    <td>:</td>
                    <td>
                      {detailLokal.keluhans.files.length > 0 ? (
                        <>
                          <ul>
                            {detailLokal.keluhans.files.map((file, index) => (
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
                lat: detailLokal.keluhans.pelanggan.lat,
                lng: detailLokal.keluhans.pelanggan.long,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
