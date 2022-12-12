import React, { useEffect, useState } from "react";

const useAxios = () => {
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); //different!
  const [controller, setController] = useState();

  const axiosFuc = async (configObj) => {
    const { axiosInstance, method, url, requestConfig = {} } = configObj;
    console.log({...requestConfig.data});
    try {
      setLoading(true);
      setError(null);
      const ctrl = new AbortController();
      setController(ctrl);
      const {data:res} = await axiosInstance[method.toLowerCase()](url, {
        ...requestConfig,
        signal: ctrl.signal,
      });
      setResponse(res.data);
    } catch (err) {
      let error = null;
      if (err?.response?.status === 422) {
        error = { error: err.response.data.errors, type: "validation" };
      } else if (err?.response?.status === 403) {
        error = { error: err.response.data.errors, type: "bad" };
      } else if (err?.response?.status === 401) {
        error = { error: err.response.data.message, type: "bad" };
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

  return [response, error, loading, axiosFuc];
};

export default useAxios;
