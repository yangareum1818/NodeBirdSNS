import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../reducers";

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
  debug: process.env.NODE_ENV !== "development",
});

// import { createWrapper } from "next-redux-wrapper";
// import { applyMiddleware, compose, legacy_createStore } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
// import createSagaMiddleware from "redux-saga";

// import reducer from "../reducers";
// import rootSaga from "../sagas";

// const loggerMiddleware =
//   ({ dispatch, getState }) =>
//   (next) =>
//   (action) => {
//     // if (typeof action === `function`) {
//     //   return action(dispatch, getState, extraArgument);
//     // }
//     return next(action);
//   };

// const configureStore = () => {
//   const sagaMiddleware = createSagaMiddleware();
//   const middleware = [sagaMiddleware, loggerMiddleware];
//   const enhancer =
//     process.env.NODE_ENV === "production"
//       ? compose(applyMiddleware(...middleware))
//       : composeWithDevTools(applyMiddleware(...middleware));
//   const store = legacy_createStore(reducer, enhancer);
//   store.sagaTask = sagaMiddleware.run(rootSaga);

//   return store;
// };

// const wrapper = createWrapper(configureStore, {
//   debug: process.env.NODE_ENV === "development",
// });

// export default wrapper;
