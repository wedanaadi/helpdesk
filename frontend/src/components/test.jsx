import axios from "axios";
import React, { useState } from "react";

export default function Test() {
  const [name, setName] = useState("adi");
  const [foto, setFoto] = useState(null);

  function handleChange(e) {
    let filess = [];
    for (let index = 0; index < e.target.files.length; index++) {
      filess.push(e.target.files[index]);
    }
    setFoto(filess);
  }

  function submited(e) {
    e.preventDefault();
    axios.post("http://localhost/helpdesk/backend/api/keluhan", {
      name,
      foto,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth")}`,
        Accept: `application/json`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  return (
    <form onSubmit={submited}>
      <input type="file" multiple onChange={handleChange} />
      <input type="text" />
      <button type="submit">CLick</button>
    </form>
  );
}
