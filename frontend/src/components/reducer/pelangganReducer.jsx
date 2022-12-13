export const INITIAL_STATE = {
  nama_pelanggan: "",
  alamat:"",
  email:"",
  lat:"",
  long:"",
  telepon:"",
  role:"",
  provinsi:"",
  kabkot:"",
  kecamatan:"",
  kelurahan:"",
};

export const pelangganReducer = (state, action) => {
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
