import PropTypes from "prop-types";
import React, { useState } from "react";
import Slick from "react-slick";
import { CloseCircleFilled } from "@ant-design/icons";
import styled, { createGlobalStyle } from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const Header = styled.header`
  padding: 0;
  position: relative;
  height: 50px;
  background: #fafafa;
  text-align: center;

  & h1 {
    margin: 0;
    color: #333;
    font-size: 20px;
    line-height: 50px;
  }

  & .anticon-close-circle {
    position: absolute;
    top: 0;
    right: 0;
    padding: 13px;
    font-size: 24px;
    cursor: pointer;
  }
`;

const SlickWrapper = styled.div`
  height: calc(100% - 50px);
  background: rgba(0, 0, 0, 0.9);
`;

const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

const Indicator = styled.div`
  text-align: center;

  & > div {
    display: inline-block;
    width: 75px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #313131;
    font-size: 15px;
    text-align: center;
    border-radius: 15px;
  }
`;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState("");

  return (
    <Overlay>
      <Header>
        <h1>상세 이미지</h1>
        <CloseCircleFilled onClick={onClose} />
      </Header>
      <SlickWrapper>
        <Slick
          initialSlide={0}
          afterChange={(slide) => setCurrentSlide(slide)}
          infinite
          arrows={false}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {images.map((v) => (
            <ImgWrapper key={v.src}>
              <img src={v.src} alt={v.src} />
            </ImgWrapper>
          ))}
        </Slick>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
