import React, { Suspense } from "react";
import { RequiredAuth } from "./components/hook/MiddlewareAuth";
import { RequiredLogin } from "./components/hook/RedirectHome";
import Spinner from "./components/layout/Spinner";
import Map from "./components/Map";
import Test from "./components/test";
const base_url = import.meta.env.VITE_bASE_ROUTE;
const Home = React.lazy(() => import("./components/pages/Home"));
const Login = React.lazy(() => import("./components/pages/Login"));
const Dashboard = React.lazy(() => import("./components/pages/Dahboard"));
const LoadingPage = React.lazy(() => import("./components/LoadingPage"));
const Kategori = React.lazy(() => import("./components/pages/kategori/Index"));
const KategoriAdd = React.lazy(() => import("./components/pages/kategori/Add"));
const KategoriEdit = React.lazy(() => import("./components/pages/kategori/Edit"));
const Pegawai = React.lazy(() => import("./components/pages/pegawai/index"));
const PegawaiAdd = React.lazy(() => import("./components/pages/pegawai/Add"));
const PegawaiEdit = React.lazy(() => import("./components/pages/pegawai/Edit"));
const NotFound = React.lazy(() => import("./components/pages/404"));
const Pelanggan = React.lazy(() => import("./components/pages/pelanggan/Index"));
const PelangganAdd = React.lazy(() => import("./components/pages/pelanggan/Add"));
const PelangganEdit = React.lazy(() => import("./components/pages/pelanggan/Edit"));
const Keluhan = React.lazy(() => import("./components/pages/keluhan/Index"));
const KeluhanDetail = React.lazy(() => import("./components/pages/keluhan/Detail"));
const KeluhanAdd = React.lazy(() => import("./components/pages/keluhan/Add"));
const KeluhanEdit = React.lazy(() => import("./components/pages/keluhan/Edit"));
const KeluhanAddPelanggan = React.lazy(() => import("./components/pages/keluhan/AddForPelanggan"));
const KeluhanEditPelanggan = React.lazy(() => import("./components/pages/keluhan/EditForPelanggan"));
const KeluhanPelanggan = React.lazy(() => import("./components/pages/keluhan/IndexPelanggan"));
const Maintenance = React.lazy(() => import("./components/pages/maintenance/Index"));
const MaintenanceAdd = React.lazy(() => import("./components/pages/maintenance/FormAdd"));
const MaintenanceEdit = React.lazy(() => import("./components/pages/maintenance/FormEdit"));
const MaintenanceDetail = React.lazy(() => import("./components/pages/maintenance/Detail"));
const ReportSolved = React.lazy(() => import("./components/pages/laporan/Solved"));
const ReportMaintenance = React.lazy(() => import("./components/pages/laporan/Maintenance"));
const Pesan = React.lazy(() => import("./components/pages/Notifikasi"));
const ViewPesan = React.lazy(() => import("./components/pages/ViewNotif"));

export default [
  {
    path: `*`,
    element: (
      <Suspense>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: `${base_url}/`,
    element: (
      <RequiredAuth>
        <Suspense fallback={<Spinner />}>
          <Home />
        </Suspense>
      </RequiredAuth>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: `${base_url}/kategori`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <Kategori />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/kategori/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KategoriAdd />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/kategori/edit`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KategoriEdit />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/pegawai`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <Pegawai />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/pegawai/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <PegawaiAdd />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/pegawai/edit`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <PegawaiEdit />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/pelanggan`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <Pelanggan />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/pelanggan/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <PelangganAdd />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/pelanggan/edit`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <PelangganEdit />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <Keluhan />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan/pelanggan`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanPelanggan />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanAdd />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan/pelanggan/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanAddPelanggan />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan/detail`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanDetail />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan/edit`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanEdit />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/keluhan/pelanggan/edit`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanEditPelanggan />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/maintenance`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <Maintenance />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/maintenance/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <MaintenanceAdd />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/maintenance/edit`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <MaintenanceEdit />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/maintenance/detail`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <MaintenanceDetail />
          </Suspense>
        ),
      },
      {
        path: `${base_url}/laporan/solved`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <ReportSolved />
          </Suspense>
        )
      },
      {
        path: `${base_url}/laporan/maintenance`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <ReportMaintenance />
          </Suspense>
        )
      },
      {
        path: `${base_url}/pesan`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <Pesan />
          </Suspense>
        )
      },
      {
        path: `${base_url}/viewNotif/:id`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <ViewPesan />
          </Suspense>
        )
      }
    ],
  },
  {
    path: `${base_url}/login`,
    element: (
      <Suspense>
          <Login />
      </Suspense>
    ),
  },
];
