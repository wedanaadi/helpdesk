export const INITIAL_STATE = {
  ticket_keluhan: "",
  teknisi:"",
  note:"-",
  user_update:"",
  public_url:import.meta.env.VITE_BASE_PUBLIC,
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
