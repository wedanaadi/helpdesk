import {
  faFileLines,
  faHashtag,
  faListCheck,
  faPeopleGroup,
  faPerson,
  faScrewdriverWrench,
  faTachometerAlt,
  faTh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { baseUrl } from "../util/BaseUrl";

export default function Sidebar({ sidebarOpen }) {
  const base_url = import.meta.env.VITE_bASE_ROUTE;
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
  const baseImageUrl = `${import.meta.env.VITE_STORAGE_BACKEND}/img`;
  const baseImageDefault = `${baseUrl}/img/userlogo.png`;
  const hk = LokalUser?.role;
  let name = "";
  let role = "";
  if (LokalUser?.role == "5") {
    name = LokalUser?.relasi?.name;
    role = "Super User";
  } else if (LokalUser?.role == "4") {
    name = LokalUser?.relasi?.nama_pelanggan;
    role = "Pelanggan";
  } else {
    name = LokalUser?.relasi?.nama_pegawai;
    if (LokalUser?.role == "1") {
      role = "Admin";
    } else if (LokalUser?.role == "2") {
      role = "Helpdesk";
    } else {
      role = "Teknisi";
    }
  }

  const location = useLocation();

  return (
    <aside className={`sidebar pe-4 pb-3 ${sidebarOpen ? "open" : false}`}>
      <nav className="navbar bg-light navbar-light">
        <Link to={`${base_url}/`} className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">
            {/* <i className="fa fa-hashtag me-2" /> */}
            {/* <FontAwesomeIcon icon={faHashtag} className="me-2" /> */}
            <img src={logo} alt="logo" width={"50px"} />
            DASHAPP
          </h3>
        </Link>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img
              className="rounded-circle"
              src={
                LokalUser?.relasi?.profil === "-"
                  ? baseImageDefault
                  : `${baseImageUrl}/${LokalUser?.relasi?.profil}`
              }
              alt="image"
              style={{ width: 40, height: 40 }}
            />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
          </div>
          <div className="ms-3">
            <h6 className="mb-0"></h6>
            <span>{role}</span>
          </div>
        </div>
        <div className="navbar-nav w-100">
          <Link
            to={`${base_url}/`}
            className={`nav-item nav-link ${
              location.pathname == base_url + "/" ? "active" : ""
            } `}
          >
            {/* <i className="fa fa-tachometer-alt me-2" /> */}
            <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
            Dashboard
          </Link>
          {hk == "1" || hk == "5" ? (
            <>
              <Link
                to={`${base_url}/kategori`}
                className={`nav-item nav-link ${
                  location.pathname == base_url + "/kategori" ||
                  location.pathname == base_url + "/kategori/add" ||
                  location.pathname == base_url + "/kategori/edit"
                    ? "active"
                    : ""
                }`}
              >
                {/* <i className="fa fa-th me-2" /> */}
                <FontAwesomeIcon icon={faTh} className="me-2" />
                Kategori
              </Link>
              <Link
                to={`${base_url}/pegawai`}
                className={`nav-item nav-link ${
                  location.pathname == base_url + "/pegawai" ||
                  location.pathname == base_url + "/pegawai/add" ||
                  location.pathname == base_url + "/pegawai/edit"
                    ? "active"
                    : ""
                }`}
              >
                {/* <i className="fa fa-th me-2" /> */}
                <FontAwesomeIcon icon={faPerson} className="me-2" />
                Pegawai
              </Link>
            </>
          ) : (
            false
          )}
          {hk == "1" || hk == "2" || hk == "5" ? (
            <Link
              to={`${base_url}/pelanggan`}
              className={`nav-item nav-link ${
                location.pathname == base_url + "/pelanggan" ||
                location.pathname == base_url + "/pelanggan/add" ||
                location.pathname == base_url + "/pelanggan/edit"
                  ? "active"
                  : ""
              }`}
            >
              {/* <i className="fa fa-th me-2" /> */}
              <FontAwesomeIcon icon={faPeopleGroup} className="me-2" />
              Pelanggan
            </Link>
          ) : (
            false
          )}
          {hk == "1" || hk == "2" || hk == "5" ? (
            <>
              <Link
                to={`${base_url}/keluhan`}
                className={`nav-item nav-link ${
                  location.pathname == base_url + "/keluhan" ||
                  location.pathname == base_url + "/keluhan/add" ||
                  location.pathname == base_url + "/keluhan/addSystem" ||
                  location.pathname == base_url + "/keluhan/detail" ||
                  location.pathname == base_url + "/keluhan/edit"
                    ? "active"
                    : ""
                }`}
              >
                {/* <i className="fa fa-th me-2" /> */}
                <FontAwesomeIcon icon={faListCheck} className="me-2" />
                Keluhan
              </Link>
            </>
          ) : (
            false
          )}
          {hk == "4" || hk == "5" ? (
            <>
              <Link
                to={`${base_url}/keluhan/pelanggan`}
                className={`nav-item nav-link ${
                  location.pathname == base_url + "/keluhan/pelanggan" ||
                  location.pathname == base_url + "/keluhan/pelanggan/add" ||
                  location.pathname == base_url + "/keluhan/pelanggan/edit"
                    ? "active"
                    : ""
                }`}
              >
                {/* <i className="fa fa-th me-2" /> */}
                <FontAwesomeIcon icon={faListCheck} className="me-2" />
                Keluhan
              </Link>
            </>
          ) : (
            false
          )}
          {hk != "4" ? (
            <>
              <Link
                to={`${base_url}/maintenance`}
                className={`nav-item nav-link ${
                  location.pathname == base_url + "/maintenance" ||
                  location.pathname == base_url + "/maintenance/add" ||
                  location.pathname == base_url + "/maintenance/edit"
                    ? "active"
                    : ""
                }`}
              >
                {/* <i className="fa fa-th me-2" /> */}
                <FontAwesomeIcon icon={faScrewdriverWrench} className="me-2" />
                Maintenance
              </Link>
            </>
          ) : (
            false
          )}
          {hk == "1" || hk == "5" ? (
            <div className="nav-item dropdown">
              <a
                href="#"
                className={`nav-link dropdown-toggle ${
                  location.pathname == base_url + "/laporan/solved" ||
                  location.pathname == base_url + "/laporan/maintenance"
                    ? "show active"
                    : ""
                }`}
                data-bs-toggle="dropdown"
                aria-expanded={`${
                  location.pathname == base_url + "/laporan/solved" ||
                  location.pathname == base_url + "/laporan/maintenance"
                    ? "true"
                    : "false"
                }`}
              >
                {/* <i className="fa fa-laptop me-2" /> */}
                <FontAwesomeIcon icon={faFileLines} className="me-2" />
                Laporan
              </a>
              <div
                className={`dropdown-menu bg-transparent border-0 ${
                  location.pathname == base_url + "/laporan/solved" ||
                  location.pathname == base_url + "/laporan/maintenance"
                    ? "show"
                    : ""
                }`}
              >
                <Link
                  to={`${base_url}/laporan/solved`}
                  className={`dropdown-item ${
                    location.pathname == base_url + "/laporan/solved"
                      ? "active"
                      : ""
                  }`}
                >
                  Laporan Complaint
                </Link>
                <Link
                  to={`${base_url}/laporan/maintenance`}
                  className={`dropdown-item ${
                    location.pathname == base_url + "laporan/maintenance"
                      ? "active"
                      : ""
                  }`}
                >
                  Laporan Maintenance
                </Link>
              </div>
            </div>
          ) : (
            false
          )}
        </div>
      </nav>
    </aside>
  );
}
