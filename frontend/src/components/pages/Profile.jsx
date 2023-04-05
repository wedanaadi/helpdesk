import React, { Suspense } from "react";
const ProfilPegawai = React.lazy(() => import("./pegawai/ProfilPegawai"));
//! NOTE: Profile untuk user pegawai
const ProfilPelanggan = React.lazy(() => import("./pelanggan/ProfilPelanggan"));
//! NOTE: profile untuk user pelanggan

export default function Profile() {
  const LokalUser = JSON.parse(localStorage.getItem("userData"));

  return (
    <>
      <div className="row g-4">
        <div className="col-12 mx-0">
          <div className="bg-light rounded p-3">
            <h3 className="mb-0">User Profile</h3>
          </div>
        </div>
      </div>

      <Suspense>
        {LokalUser.role !== 4 ? <ProfilPegawai dataLogin={LokalUser} /> : <ProfilPelanggan dataLogin={LokalUser} />}
      </Suspense>
    </>
  );
}
