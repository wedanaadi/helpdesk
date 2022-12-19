import React, { Suspense } from "react";
import LoadingPage from "../../LoadingPage";
const ChartComplaint = React.lazy(()=>import('./ChartComplant'))
const ChartMaintenance = React.lazy(()=>import('./ChartMaintenance'))

export default function Blank() {
  return (
    <>
      <Suspense fallback={<LoadingPage text={'Load Dashboard....'} />}>
        <ChartComplaint/>
        <ChartMaintenance/>
      </Suspense>
    </>
  );
}
