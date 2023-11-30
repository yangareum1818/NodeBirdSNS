import { combineReducers } from "redux";
import axios from "axios";

import userSlice from "./user";
import postSlice from "./post";

axios.defaults.baseURL = "http://localhost:3065";
axios.defaults.withCredentials = true;

const reducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});

// const initialState = {
//   user: {},
//   post: {},
// };

// 1. redux
// (이전상태, 액션) => 다음상태
// const rootReducer = combineReducers({
//   index: (state = {}, action) => {
//     switch (action.type) {
//       case HYDRATE:
//         console.log("HYDRATE", action);
//         return {
//           ...state,
//           ...action.payload,
//         };

//       default:
//         return state;
//     }
//   },
//   user,
//   post,
// });
// 2. redux-saga
// const rootReducer = (state, action) => {
//   switch (action.type) {
//     case HYDRATE:
//       console.log("HYDRATE", action);
//       return action.payload;

//     default: {
//       const combineReducer = combineReducers({
//         user,
//         post,
//       });
//       return combineReducer(state, action);
//     }
//   }
// };
export default reducer;
