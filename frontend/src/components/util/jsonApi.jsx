import axios from "axios";

const base_url = import.meta.env.VITE_BASE_BACKEND;

export default axios.create({
  baseURL: base_url,
  headers: {
    Accept: "application/json",
  },
});
