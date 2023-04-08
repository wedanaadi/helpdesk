import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useHookAxios from "../hook/useHookAxios";
import LoadingPage from "../LoadingPage";
import axios from "../util/jsonApi";
import ToDate from "../util/ToDate";

export default function ViewNotif() {
  const { id } = useParams();
  const [response, error, loading, axiosFunction] = useHookAxios();
  const [isReacd, errorIsRead, loadingIsRead, isReadFunction] = useHookAxios();
  const LokalData = JSON.parse(localStorage.getItem("userData"));
  const [axiosHandle, setAxiosHandle] = useState(false);

  const getData = () => {
    axiosFunction({
      axiosInstance: axios,
      method: "GET",
      url: "getNotif",
      data: null,
      reqConfig: {
        params: {
          idPengirim: id,
          idLogin: LokalData.idUser,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const inv = setTimeout(() => {
      getData();
    }, 1);
    return () => clearInterval(inv);
  }, []);

  const handleIsRead = (data) => {
    setAxiosHandle(true)
    isReadFunction({
      axiosInstance: axios,
      method: "GET",
      url: "Notifikasi-isRead",
      data: null,
      reqConfig: {
        params: {
          id: data.id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  }

  useEffect(() => {
    axiosHandle && getData();
  }, [isReacd, errorIsRead]);

  return (
    <div className="row bg-light mx-0 rounded">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">Pesan</h3>
        <Link to={`/pesan`} className="btn btn-success mb-0">
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Kirim Pesan
        </Link>
      </div>
      <div className="p-3 border-bottom">
        <section className="py-2">
          <ul className="timeline">
            {response.length == 0 && <LoadingPage text={`Tidak ada pesan`} />}
            {response?.length > 0 &&
              response.map((data, index) => (
                <li className="timeline-item mb-5" key={index}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold">{data.sender.nama_pegawai}</h5>
                    <button className="btn btn-info" onClick={() => handleIsRead(data)}>Tandai Sudah Baca</button>
                  </div>
                  <p className="text-muted mb-2 fw-bold">
                    {data.body}
                    {/* {ToDate(log.created_at, "full")} */}
                  </p>
                  <p className="text-muted mb-2 fw-bold">
                    {ToDate(parseInt(data.created_at), "full")}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
