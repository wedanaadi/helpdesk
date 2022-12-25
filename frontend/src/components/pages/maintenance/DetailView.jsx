import React, { useEffect, useState } from "react";
import queryString from "query-string";
import useHookAxios from "../../hook/useHookAxios";
import axios from "../../util/jsonApi"
import { baseUrl } from "../../util/BaseUrl";
import { useNavigate } from "react-router-dom";

export default function DetailView() {
  const {ticket} = queryString.parse(location.search);
  const [response, error, loading, axiosFunc] = useHookAxios();
  const [axiosHandle, setAxiosHandle] = useState(false);
  const navigasi = useNavigate()

  const getDetail = () => {
    setAxiosHandle(true);
    axiosFunc({
      axiosInstance: axios,
      method: "GET",
      url: 'maintenance-detail',
      data: null,
      reqConfig: {
        params: {
          ticketMaintenance: ticket,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      },
    });
  }

  useEffect(() => {
    getDetail();
  }, []);

  const handleAxios = () => {
    let message = "";
    
    if (!loading && error) {
      setAxiosHandle(false);
    }

    if (response && !error && !loading) {
      const UserLogin = JSON.parse(localStorage.getItem('userData'));
      if(UserLogin.idUser!=response.pegawai_id) {
        alert('Anda bukan teknisi yang ditugaskan')
        navigasi(`${baseUrl}/`);
      } else {
        localStorage.setItem("detailMaintenance", JSON.stringify(response));
        navigasi(`${baseUrl}/maintenance/detail`);
      }
      setAxiosHandle(false);
    }
  };

  useEffect(() => {
    axiosHandle && handleAxios();
  }, [response, error]);

  return <div>Loading....</div>;
}
