export const INITIAL_STATE = {
  penerima:'',
  pesan:'',
  pengirim:'',

};

export const sendReducer = (state, action) => {
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
