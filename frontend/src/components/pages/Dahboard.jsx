import React, { Suspense } from "react";
const D1 = React.lazy(() => import("../pages/dasboard/Blank"));
//! NOTE: dashboard untuk user admin / helpdesk
const D2 = React.lazy(() => import("./dasboard/Task"));
//! NOTE: dashboard untuk user teknisi
const D3 = React.lazy(() => import("./dasboard/Hello"));
//! NOTE: dashboard untuk user pelanggan

export default function Dahboard() {
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
  // ! NOTE: Kode view (halaman)
  return (
    <>
     {/* NOTE : login user pelanggan */}
      {LokalUser?.role == "4"  || LokalUser?.role == '5' ? (
        <>
          <Suspense>
            <D3 />
          </Suspense>
          <br />
        </>
      ) : (
        false
      )}
       {/* NOTE : Input untuk admin / helpdesk */}
      {LokalUser?.role == "1" || LokalUser?.role == "2" || LokalUser?.role == '5' ? (
        <>
        <Suspense>
          <D1 />
        </Suspense>
        <br />
      </>
      ) : (
        false
      )}
       {/* NOTE : Input untuk teknisi */}
      {LokalUser?.role == "3" || LokalUser?.role == '5' ? (
        <>
        <Suspense>
          <D2 />
        </Suspense>
        <br />
      </>
      ) : (
        false
      )}
    </>
  );
}
