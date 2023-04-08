import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";
import ToDate from "../../util/ToDate";

export default function Tracking() {
  const { id } = useParams();
  const [response, error, loading, axiosFunc] = useHookAxios();
  const lokalUser = JSON.parse(localStorage.getItem("userData"));

  const getTrack = () => {
    axiosFunc({
      axiosInstance: axios,
      method: "GET",
      url: `log-keluhan`,
      data: null,
      reqConfig: {
        params: {
          idKeluhan: id,
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
    <div className="row g-4">
      <div className="col-12 mx-0">
        <div className="bg-light rounded">
          <div className="d-flex justify-content-between align-items-center border-bottom p-3">
            <h3 className="pb-1 mb-0">
              Nomor Ticket: <b>{id}</b>
            </h3>
             {/* NOTE : Tombol Kembali */}
            <Link
              to={`${baseUrl}/${lokalUser.role === "3" ? 'maintenance':'keluhan'}/detail`}
              className="btn btn-secondary mb-0"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              &nbsp; Kembali
            </Link>
          </div>
        </div>
      </div>
      <div className="p-3 border-bottom">
        {/* Timeline update tracking */}
        <section className="py-2">
          <ul className="timeline">
            {response.length > 0 &&
              response.map((log, index) =>
                index == 0 ? (
                  <li className="timeline-item mb-5" key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div
                        className="fw-bold text-timeline"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {log.deskripsi}
                      </div>
                    </div>
                    <p className="text-muted mb-0 fw-bold">
                      Update By <span className="text-primary">{log.updated_by}</span>
                    </p>
                    <p className="text-muted mb-2 fw-bold">
                      {ToDate(parseInt(log.created_at), "full")}
                    </p>
                  </li>
                ) : (
                  <li className="timeline-item mb-5" key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ whiteSpace: "pre-line" }}>
                        {log.deskripsi}
                      </div>
                    </div>
                    <p className="text-muted mb-0">
                      Update By <span className="fw-bold">{log.updated_by}</span>
                    </p>
                    <p className="text-muted mb-2">
                      {ToDate(parseInt(log.created_at), "full")}
                    </p>
                  </li>
                )
              )}
          </ul>
        </section>
      </div>
    </div>
  );
}
