export const INITIAL_STATE = {
  nama_pegawai: "",
  alamat:"",
  email:"",
  username:"",
  password:"",
  telepon:"",
  role:"",
  public_url:import.meta.env.VITE_BASE_PUBLIC,
};

export const pegawaiReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    default:
      return state;
  }
};
