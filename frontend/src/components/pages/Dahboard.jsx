import React, { Suspense } from "react";
const D1 = React.lazy(() => import("../pages/dasboard/Blank"));
const D2 = React.lazy(() => import("./dasboard/Task"));
const D3 = React.lazy(() => import("./dasboard/Hello"));

export default function Dahboard() {
  const LokalUser = JSON.parse(localStorage.getItem("userData"));
  return (
    <>
      {/* {LokalUser.role == "4"  || LokalUser.role == '5' ? (
        <>
          <Suspense>
            <D3 />
          </Suspense>
          <br />
        </>
      ) : (
        false
      )}
      {LokalUser.role == "1" || LokalUser.role == "2" || LokalUser.role == '5' ? (
        <>
        <Suspense>
          <D1 />
        </Suspense>
        <br />
      </>
      ) : (
        false
      )}
      {LokalUser.role == "3" || LokalUser.role == '5' ? (
        <>
        <Suspense>
          <D2 />
        </Suspense>
        <br />
      </>
      ) : (
        false
      )} */}
    </>
  );
}
