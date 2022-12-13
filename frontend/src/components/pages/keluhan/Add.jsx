import React, { useState } from "react";
import axios from "axios";

export default function Add() {
  const [berkas, setFile] = useState(null);
  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost/helpdesk/backend/api/keluhan",
        { berkas, nama: "adi" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
            Accept: `application/json`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFile} />
      <button type="submit">Click</button>
    </form>
  );
}
