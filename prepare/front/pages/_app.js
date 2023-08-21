import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import wrapper from "../store/configureStore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://nodebird.com/favicon.ico" />
        <link rel="icon" href="https://nodebird.com/favicon.ico" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
