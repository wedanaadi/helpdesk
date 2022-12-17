import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useHookAxios from "../hook/useHookAxios";
import axios from '../util/jsonApi'
import ToDate from "../util/ToDate"

export default function ViewNotif() {
  const {id} = useParams()
  const [response, error, loading, axiosFunction] = useHookAxios();
  const LokalData = JSON.parse(localStorage.getItem('userData'))

  const getData = () => {
    axiosFunction({
      axiosInstance: axios,
      method: "GET",
      url: 'getNotif',
      data: null,
      reqConfig: {
        params: {
          idPengirim:id,
          idLogin: LokalData.idUser,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    })
  }

  useEffect(()=>{
    const inv = setTimeout(() => {
      getData()
    }, 1);
    return () => clearInterval(inv)
  },[]);

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
            {
              response?.length> 0 && response.map((data,index)=>(<div key={index}>
                <li className="timeline-item mb-5">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold">{LokalData.idUser == data.created_user ? data.sender.nama_pegawai : data.getter.nama_pegawai}</h5>
                  </div>
                  <p className="text-muted mb-2 fw-bold">
                    {data.body}
                    {/* {ToDate(log.created_at, "full")} */}
                  </p>
                  <p className="text-muted mb-2 fw-bold">
                    {ToDate(data.created_at, "full")}
                  </p>
                </li>
              </div>))
            }
          </ul>
        </section>
      </div>
    </div>
  );
}
