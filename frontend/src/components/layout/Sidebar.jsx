import { faChartBar, faFileAlt, faHashtag, faKeyboard, faLaptop, faTable, faTachometer, faTachometerAlt, faTh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({sidebarOpen}) {
  const base_url = import.meta.env.VITE_bASE_ROUTE;

  return (
    <aside className={`sidebar pe-4 pb-3 ${sidebarOpen ? 'open' : false}`}>
        <nav className="navbar bg-light navbar-light">
          <Link to={`${base_url}/`} className="navbar-brand mx-4 mb-3">
            <h3 className="text-primary">
              {/* <i className="fa fa-hashtag me-2" /> */}
              <FontAwesomeIcon icon={faHashtag} className="me-2" />
              DASHMIN
            </h3>
          </Link>
          <div className="d-flex align-items-center ms-4 mb-4">
            <div className="position-relative">
              <img
                className="rounded-circle"
                src={`${base_url}/img/user.jpg`}
                alt="image"
                style={{ width: 40, height: 40 }}
              />
              <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
            </div>
            <div className="ms-3">
              <h6 className="mb-0">Jhon Doe</h6>
              <span>Admin</span>
            </div>
          </div>
          <div className="navbar-nav w-100">
            <a href="index.html" className="nav-item nav-link">
              {/* <i className="fa fa-tachometer-alt me-2" /> */}
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              Dashboard
            </a>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {/* <i className="fa fa-laptop me-2" /> */}
                <FontAwesomeIcon icon={faLaptop} className="me-2" />
                Elements
              </a>
              <div className="dropdown-menu bg-transparent border-0">
                <a href="button.html" className="dropdown-item">
                  Buttons
                </a>
                <a href="typography.html" className="dropdown-item">
                  Typography
                </a>
                <a href="element.html" className="dropdown-item">
                  Other Elements
                </a>
              </div>
            </div>
            <Link to={`${base_url}/kategori`} className="nav-item nav-link">
              {/* <i className="fa fa-th me-2" /> */}
              <FontAwesomeIcon icon={faTh} className="me-2" />
              Kategori
            </Link>
            <Link to={`${base_url}/pegawai`} className="nav-item nav-link">
              {/* <i className="fa fa-th me-2" /> */}
              <FontAwesomeIcon icon={faKeyboard} className="me-2" />
              Pegawai
            </Link>
            <a href="table.html" className="nav-item nav-link">
              {/* <i className="fa fa-table me-2" /> */}
              <FontAwesomeIcon icon={faTable} className="me-2" />
              Tables
            </a>
            <a href="chart.html" className="nav-item nav-link">
              {/* <i className="fa fa-chart-bar me-2" /> */}
              <FontAwesomeIcon icon={faChartBar} className="me-2" />
              Charts
            </a>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle active"
                data-bs-toggle="dropdown"
              >
                {/* <i className="far fa-file-alt me-2" /> */}
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Pages
              </a>
              <div className="dropdown-menu bg-transparent border-0">
                <a href="signin.html" className="dropdown-item">
                  Sign In
                </a>
                <a href="signup.html" className="dropdown-item">
                  Sign Up
                </a>
                <a href="404.html" className="dropdown-item">
                  404 Error
                </a>
                <a href="blank.html" className="dropdown-item active">
                  Blank Page
                </a>
              </div>
            </div>
          </div>
        </nav>
      </aside>
  )
}
