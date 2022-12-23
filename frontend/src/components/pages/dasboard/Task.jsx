import React, { useEffect } from "react";
import useHookAxios from "../../hook/useHookAxios";
import axios from "../../util/jsonApi";

export default function Task() {
  const LokalData = JSON.parse(localStorage.getItem("userData"));
  const roleId = LokalData.role;

  const [response, err, loading, axiosFunc] = useHookAxios();

  const getTask = () => {
    axiosFunc({
      axiosInstance: axios,
      method: "GET",
      url: `maintenance`,
      data: null,
      reqConfig: {
        params: {
          role: roleId,
          idUser: LokalData.idUser,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  };

  useEffect(() => {
    getTask();
  }, []);
  return (
    <div className="row bg-light rounded mx-0">
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h3 className="mb-0">List Maintenance Pending / Open</h3>
      </div>
      <div className="table-responsice">
        <table className="table table-bordered">
          <thead>
            <tr className="text-center">
              <th>Ticket Maintenance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {response?.data?.length > 0 ? (
              response.data.map((data, index) =>
                data.status != "1" ? (
                  <tr key={index}>
                    <td className="fw-bold">{data.tiket_maintenance}</td>
                    <td>{data.status_desc}</td>
                  </tr>
                ) : (
                  false
                )
              )
            ) : (
              <>
                <tr className="text-center">
                  <td colSpan={2}>Tidak Ada Data</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
