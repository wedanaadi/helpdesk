export const INITIAL_STATE = {
  nama_pegawai: "",
  alamat:"",
  email:"",
  username:"",
  password:"",
  telepon:"",
  role:"",
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
