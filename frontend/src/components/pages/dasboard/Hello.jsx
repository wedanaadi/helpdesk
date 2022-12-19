import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";

export default function Hello() {
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
  const [response, error, loading, axiosFunc] = useHookAxios();
  const navigasi = useNavigate();
  let name = "";
  let role = "";
  if (LokalUser.role == "5") {
    name = LokalUser.relasi.nama;
    role = "Super User";
  } else if (LokalUser.role == "4") {
    name = LokalUser.relasi.nama_pelanggan;
    role = "Pelanggan";
  } else {
    name = LokalUser.relasi.nama_pegawai;
    if (LokalUser.role == "1") {
      role = "Admin";
    } else if (LokalUser.role == "2") {
      role = "Helpdesk";
    } else {
      role = "Teknisi";
    }
  }

  const getKeluhan = () => {
    axiosFunc({
      axiosInstance: axios,
      method: "GET",
      url: `keluhan-pelanggan`,
      data: null,
      reqConfig: {
        params: {
          id: LokalUser.idUser,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    const invt = setTimeout(() => {
      getKeluhan();
    }, 1);
    return () => clearInterval(invt);
  }, []);

  const handleDetail = (data) => {
    localStorage.setItem("detailKeluhan", JSON.stringify(data));
    navigasi(`${baseUrl}/keluhan/detail`);
  };

  return (
    <>
      <div className="row bg-light mx-0">
        <div className="p-2">
          <h3>Hello, {name}</h3>
        </div>
      </div>
      <div className="row g-4 mt-1">
        <div className="col-12 mx-0 mb-0">
          <div className="bg-light rounded p-2">
            <h5 className="pb-1 mb-0">Ticket Complaint ON / ON PROCCESS</h5>
          </div>
        </div>
        {response.map((data, index) => (
          <div className="col-sm-6 col-xl-3" key={index}>
            <div
              className="bg-light rounded d-flex align-items-center justify-content-between px-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleDetail(data)}
            >
              <div className="ms-3">
                <h6 className="mb-2">
                  {data.tiket} ({data.status_keluhan})
                </h6>
                <p className="mb-0">{data.created_at2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
