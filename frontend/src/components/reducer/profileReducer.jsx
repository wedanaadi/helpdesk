export const INITIAL_STATE = {
  nama: "",
  alamat:"",
  email:"",
  username:"",
  password:"",
  telepon:"",
  oldProfile:"",
  profile:"",
  idUser:"",
  kordinat:"0, 0"
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "CHANGE_FILES":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };

    default:
      return state;
  }
};