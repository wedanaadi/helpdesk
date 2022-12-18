const LocalUser = JSON.parse(localStorage.getItem('userData'))

export const INITIAL_STATE = {
  keluhan_id: "",
  teknisi:"",
  deskripsi:"",
  status:"1",
  ticket_keluhan:"",
};

export const updateKelurahanReducer = (state, action) => {
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
