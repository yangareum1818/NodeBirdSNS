import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../reducers";

// const loggerMiddleware =
//   ({ dispatch, getState }) =>
//   (next) =>
//   (action) => {
//     // if (typeof action === `function`) {
//     //   return action(dispatch, getState, extraArgument);
//     // }
//     return next(action);
//   };

function getServerState() {
  return typeof document !== "undefined"
    ? JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
        .pageProps.initialState
    : undefined;
}
const serverState = getServerState();

console.log("serverState", serverState);

const makeStore = () =>
  configureStore({
    reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    preloadedState: serverState,
  });

export default createWrapper(makeStore, {
  debug: process.env.NODE_ENV === "development",
});
