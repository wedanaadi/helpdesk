import React, { Suspense } from "react";
import { RequiredAuth } from "./components/hook/MiddlewareAuth";
import { RequiredLogin } from "./components/hook/RedirectHome";
import Spinner from "./components/layout/Spinner";
import Map from "./components/Map";
import Test from "./components/test";
const base_url = import.meta.env.VITE_bASE_ROUTE;
const Home = React.lazy(() => import("./components/pages/Home"));
const Login = React.lazy(() => import("./components/pages/Login"));
const Blank = React.lazy(() => import("./components/pages/Blank"));
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
const KeluhanAdd = React.lazy(() => import("./components/pages/keluhan/Add"));
const KeluhanEdit = React.lazy(() => import("./components/pages/keluhan/Edit"));

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
        element: <Blank />,
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
        path: `${base_url}/keluhan/add`,
        element: (
          <Suspense fallback={<LoadingPage text={"Load Page"} />}>
            <KeluhanAdd />
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
