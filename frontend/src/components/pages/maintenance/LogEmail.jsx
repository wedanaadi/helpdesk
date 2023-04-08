import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import LoadingPage from "../../LoadingPage";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";
import ToDate from "../../util/ToDate";

export default function LogEmail() {
  const dataStorage = JSON.parse(atob(localStorage.getItem("logsEmail")));
  const [response, error, loading, axiosFunc] = useHookAxios();

  const getTrack = () => {
    axiosFunc({
      axiosInstance: axios,
      method: "GET",
      url: `logs-email`,
      data: null,
      reqConfig: {
        params: {
          ticket: dataStorage.tiket_maintenance,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const invt = setTimeout(() => {
      getTrack();
    }, 1);
    return () => clearInterval(invt);
  }, []);

  //! NOTE: kode untuk view
  return (
    <>
      <div className="row g-4">
        <div className="col-12 mx-0">
          <div className="bg-light rounded p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">History Email Ticket </h3>
               {/* NOTE : Tombol kembali */}
              <Link
                to={`${baseUrl}/maintenance`}
                className="btn btn-secondary mb-0"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Kembali
              </Link>
            </div>
             {/* NOTE : Timeline log Email */}
            <div className="p-3 border-bottom">
              <section className="py-2">
                {loading && <LoadingPage text={"Loading logs...."} />}
                {response.length === 0 && <LoadingPage text={"Tidak ada logs...."} />}
                <ul className="timeline">
                  {response.length > 0 &&
                    response.map((log, index) =>
                      index == 0 ? (
                        <li className="timeline-item mb-5" key={index}>
                          <span className="fw-bold text-timeline">subject : {log.subject}</span>
                          <div className="d-flex justify-content-between align-items-center">
                            <div
                              className="fw-bold text-timeline"
                              style={{ whiteSpace: "pre-line" }}
                            >
                              message: {log.message}
                            </div>
                          </div>
                          <p className="text-muted mb-0 fw-bold">
                            to: <span className="text-primary">{log.to} ({log.nama_pegawai})</span>
                          </p>
                          <p className="text-muted mb-2 fw-bold">
                            terkirim: {ToDate(parseInt(log.time_delevery), "full")}
                          </p>
                        </li>
                      ) : (
                        <li className="timeline-item mb-5" key={index}>
                          <span>subject : {log.subject}</span>
                          <div className="d-flex justify-content-between align-items-center">
                            <div style={{ whiteSpace: "pre-line" }}>
                              message &nbsp; : &nbsp; {log.message}
                            </div>
                          </div>
                          <p className="text-muted mb-0">
                            to : <span className="fw-bold">{log.to} ({log.nama_pegawai})</span>
                          </p>
                          <p className="text-muted mb-2">
                            terkirim : {ToDate(parseInt(log.time_delevery), "full")}
                          </p>
                        </li>
                      )
                    )}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
