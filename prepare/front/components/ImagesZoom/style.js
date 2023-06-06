import { CloseCircleFilled } from "@ant-design/icons";
import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

export const Header = styled.header`
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
`;
export const CloseBtn = styled(CloseCircleFilled)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 13px;
  font-size: 24px;
  cursor: pointer;
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 50px);
  background: rgba(0, 0, 0, 0.9);
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-width: 90%;
    max-height: 700px;
  }
`;

export const Indicator = styled.div`
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
