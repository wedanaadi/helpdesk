export const INITIAL_STATE = {
  pelanggan: "",
  kategori:"",
  komentar:"",
  files:[],
  isFile:'false',
};

export const kelurahanReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "CHANGE_FILE":
      if(state.files.length === 0 ) {
        for (let index = 0; index < action.payload.length; index++) {
          state.files.push(action.payload[index]);
        }
      }
      return {
        ...state,
        ["isFile"]: state.files.length > 0 ? 'true' : 'false',
      };

    default:
      return state;
  }
};
