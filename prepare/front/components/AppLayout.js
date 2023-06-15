import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Col, Input, Menu, Row } from "antd";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";

import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;
const LinkTitle = styled.span`
  font-size: 18px;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/" legacyBehavior>
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile" legacyBehavior>
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton="Search" />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup" legacyBehavior>
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <LinkTitle>Github</LinkTitle>
          <a
            href="https://github.com/yangareum1818"
            target={"_blank"}
            rel="noreferrer noopener"
            style={{ display: "block" }}
          >
            yangareum1818
          </a>
          <LinkTitle>Velog</LinkTitle>
          <a
            href="https://velog.io/@yangareum1818"
            target={"_blank"}
            rel="noreferrer noopener"
            style={{ display: "block" }}
          >
            @YangSeeInGan
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propsTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
