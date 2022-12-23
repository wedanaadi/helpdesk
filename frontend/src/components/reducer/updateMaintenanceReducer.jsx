const LocalUser = JSON.parse(localStorage.getItem('userData'))

export const INITIAL_STATE = {
  deskripsi:"",
  status:"",
  ticket_keluhan:"",
  ticket_maintenance:"",
  pegawai_id: "",
  user_update:"",
};

export const updateMaintenanceReducer = (state, action) => {
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
