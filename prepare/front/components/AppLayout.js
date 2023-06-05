import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Col, Input, Menu, Row } from "antd";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import styled from "styled-components";
import { useSelector } from "react-redux";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;
const LinkTitle = styled.span`
  font-size: 18px;
`;

const AppLayout = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <>
      <div>
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
            {isLoggedIn ? <UserProfile /> : <LoginForm />}
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
    </>
  );
};

AppLayout.propsTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
