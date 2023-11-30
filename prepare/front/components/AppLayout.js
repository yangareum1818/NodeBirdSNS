import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Col, Input, Layout, Menu, Row } from "antd";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";

import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import useInput from "../hooks/useInput";
import Router, { useRouter } from "next/router";

const { Header, Content } = Layout;

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
  const [searchInput, onChangeSearchInput] = useInput("");
  const { me } = useSelector((state) => state.user);
  const router = useRouter();
  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  const menuitems = [
    {
      key: "nodebird",
      label: <Link href="/">노드버드</Link>,
    },
    {
      key: "profile",
      label: <Link href="/profile">프로필</Link>,
    },
    {
      key: "search",
      label: (
        <SearchInput
          enterButton="Search"
          value={searchInput}
          onChange={onChangeSearchInput}
          onSearch={onSearch}
        />
      ),
    },
    {
      key: "signup",
      label: <Link href="/signup">회원가입</Link>,
    },
  ];

  return (
    <Layout>
      <Global />
      {/* 로그인 되었을 때 회원가입 메뉴 보이지 않기. */}
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[router.pathname]}
          items={menuitems}
        />
      </Header>
      <Content
        style={{ padding: "0 50px", marginTop: 64, backgroundColor: "#fff" }}
      >
        <Row gutter={8}>
          <Col xs={24} md={6}>
            {me ? <UserProfile /> : <LoginForm />}
          </Col>
          <Col xs={24} md={14}>
            {children}
          </Col>
          <Col
            xs={24}
            md={4}
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
              marginTop: 10,
            }}
          >
            <LinkTitle>Github</LinkTitle>
            <Link
              href="https://github.com/yangareum1818"
              target={"_blank"}
              rel="noreferrer noopener"
              style={{ display: "block" }}
            >
              yangareum1818
            </Link>
            <LinkTitle style={{ marginTop: 10 }}>Velog</LinkTitle>
            <Link
              href="https://velog.io/@yangareum1818"
              target={"_blank"}
              rel="noreferrer noopener"
              style={{ display: "block" }}
            >
              @YangSeeInGan
            </Link>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

AppLayout.propsTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
