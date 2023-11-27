import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { Provider } from "react-redux";
import wrapper from "../store/configureStore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NodeBird = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  console.log(props);

  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://nodebird.com/favicon.ico" />
        <link rel="icon" href="https://nodebird.com/favicon.ico" />
        <title>NodeBird</title>
      </Head>
      <Component />
      {/* pageProps={...pageProps} */}
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export function reportWebVitals(metric) {
  console.log(metric);
}

export default NodeBird;
