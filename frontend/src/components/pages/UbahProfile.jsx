import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../util/BaseUrl";
const FormProfilPegawai = React.lazy(() => import("./pegawai/ProfilPegawaiForm"));
const FormProfilPelanggan = React.lazy(() => import("./pelanggan/ProfilPelangganForm"));

export default function UbahProfile() {
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
  return (
    <>
      <div className="row g-4">
        <div className="col-12 mx-0">
          <div className="bg-light rounded p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">User Profile</h3>
              <Link
                to={`${baseUrl}/profile`}
                className="btn btn-secondary mb-0"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Suspense>
        {LokalUser.role !== "4" ? <FormProfilPegawai dataLogin={LokalUser} /> : <FormProfilPelanggan dataLogin={LokalUser} />}
      </Suspense>
    </>
  );
}
