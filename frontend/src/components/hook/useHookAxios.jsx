import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../util/BaseUrl";

const useHookAxios = () => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); //different!
  const [controller, setController] = useState();
  const navigasi = useNavigate();

  const hookFunc = async (configObj) => {
    const { axiosInstance, method, url, data = {}, reqConfig = {} } = configObj;
    try {
      setLoading(true);
      setError(null);
      const ctrl = new AbortController();
      setController(ctrl);
      if (method.toLowerCase() === "get" || method.toLowerCase() == "delete") {
        const { data: res } = await axiosInstance[method.toLowerCase()](
          url,
          reqConfig,
          { signal: ctrl.signal }
          );
          setResponse(res.data);
      } else {
        const { data: res } = await axiosInstance[method.toLowerCase()](
          url,
          data,
          reqConfig,
          { signal: ctrl.signal }
          );
          setResponse(res.data);
      }
    } catch (err) {
      let error = null;
      if (err?.response?.status === 422) {
        error = { error: err.response.data.errors, type: "validation" };
      } else if (err?.response?.status === 403) {
        error = { error: err.response.data.errors, type: "bad" };
      } else if (err?.response?.status === 401) {
        navigasi(`${baseUrl}/login`, { replace: true });
        toast.error("unauthentication", { autoClose: 1500 });
        // error = { error: err.response.data.message, type: "unauthentication" };
      } else {
        error = { error: err.response, type: "error" };
      }
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => controller && controller.abort();
  }, [controller]);

  return [response, error, loading, hookFunc];
};

export default useHookAxios;
