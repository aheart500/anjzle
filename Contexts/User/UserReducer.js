const reducer = (state, action) => {
  switch (action.type) {
    case "started": {
      return { ...state, first_time: false };
    }
    case "nonStarted": {
      return { ...state, first_time: true };
    }
    case "LOAD_DATA": {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
