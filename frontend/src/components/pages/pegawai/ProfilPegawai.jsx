import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useHookAxios from "../../hook/useHookAxios";
import LoadingPage from "../../LoadingPage";
import { baseUrl } from "../../util/BaseUrl";
import axios from "../../util/jsonApi";

export default function ProfilPegawai({ dataLogin }) {
  let roleName = null;
  const baseImageUrl = `${import.meta.env.VITE_STORAGE_BACKEND}/img`;
  const baseImageDefault = `${baseUrl}/img/userlogo.png`;
  const [profile, error, loading, axiosFuc] = useHookAxios();
  const navigasi = useNavigate();

  switch (parseInt(profile.role)) {
    case 1:
      roleName = "Admin";
      break;
    case 2:
      roleName = "Helpdesk";
      break;
    case 3:
      roleName = "Teknisi";
      break;
    case 4:
      roleName = "Pelanggan";
      break;
    default:
      roleName = "Super User";
      break;
  }

  const getData = () => {
    axiosFuc({
      axiosInstance: axios,
      method: "GET",
      url: "pegawai-profile-data",
      reqConfig: {
        params: { id: dataLogin.idUser },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEditButton = () => {
    localStorage.setItem("dataProfile", btoa(JSON.stringify(profile)));
    navigasi("edit", { replace: true });
  };

  //! NOTE: kode untuk view
  return (
    <>
      {loading && (
        <div className="mt-1">
          <LoadingPage text={"Loading Profile"} />
        </div>
      )}
      {!loading && !error && (
        <div className="row g-4 mt-1">
          <div className="col-lg-4 mx-0">
            <div className="bg-light rounded p-3">
              <div className="px-3 py-2 text-center">
                 {/* NOTE : Image Profile */}
                <img
                  src={
                    profile.profil === "-"
                      ? baseImageDefault
                      : `${baseImageUrl}/${profile.profil}`
                  }
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: "150px", height: "150px" }}
                />
                <h5 className="my-3">{profile.nama_pegawai}</h5>
                <p>{roleName}</p>
                <div className="d-flex justify-content-center mb-2">
                   {/* NOTE : Tombol Ubah Profile */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEditButton()}
                  >
                    Ubah Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mx-0">
            <div className="bg-light rounded p-3">
              <div className="px-3 py-2">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Nama</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profile.nama_pegawai}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profile.email}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Phone</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profile.telepon}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Alamat</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profile.alamat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
