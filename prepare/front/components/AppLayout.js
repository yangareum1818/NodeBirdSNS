import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Col, Input, Menu, Row } from "antd";
import { useSelector } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";

import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import useInput from "../hooks/useInput";
import Router from "next/router";

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
    <div>
      <Global />
      {/* 로그인 되었을 때 회원가입 메뉴 보이지 않기. */}
      <Menu mode="horizontal" items={menuitems} />
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
