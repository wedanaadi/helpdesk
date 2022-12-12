export const INITIAL_STATE = {
  nama_kategori: "",
};

export const kategoriReducer = (state, action) => {
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
