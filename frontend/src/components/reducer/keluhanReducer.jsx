export const INITIAL_STATE = {
  pelanggan: "",
  kategori:"",
  komentar:"",
  lampiran:null,
};

export const kelurahanReducer = (state, action) => {
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
