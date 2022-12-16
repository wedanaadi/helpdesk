import React from 'react'

export default function Hello() {
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
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
  return (
    <div className="row min-vh-100 bg-light mx-0">
      <div className="p-2 d-flex justify-content-center align-items-center">
      <h5>Hello, {name}</h5>
      </div>
    </div>
  )
}
