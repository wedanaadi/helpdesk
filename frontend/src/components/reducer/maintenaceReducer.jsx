export const INITIAL_STATE = {
  ticket_keluhan: "",
  teknisi:"",
  note:"-",
  user_update:"",
};

export const maintenanceReducer = (state, action) => {
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
