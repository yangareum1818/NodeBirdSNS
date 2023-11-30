import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { END } from "redux-saga";
import axios from "axios";

import AppLayout from "../components/AppLayout";
import useInput from "../hooks/useInput";
import {
  LOAD_MY_INFO_REQUEST,
  SIGN_UP_REQUEST,
  loadMyInfo,
  signup,
} from "../reducers/user";
import wrapper from "../store/configureStore";

const ErrorMessage = styled.p`
  color: #f00;
`;

const Signup = () => {
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");

  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const [term, setTerm] = useState("");
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector(
    (state) => state.user
  );

  console.log("me", me);

  // 회원가입페이지에서 로그인을 했을 경우
  useEffect(() => {
    if (me && me.id) Router.replace("/");
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) Router.push("/");
  }, [signUpDone]);

  useEffect(() => {
    // state 사용해서 화면에 그려도된다.
    if (signUpError) alert(signUpError); // 연결 관계 잘 파악하기 (흐름)
  }, [signUpError]);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) return setPasswordError(true);
    if (!term) return setTermError(true);

    dispatch(signup({ email, nickname, password }));

    console.log(email, nickname, password);
  }, [email, password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            type={"email"}
            value={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            type={"password"}
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호 체크</label>
          <br />
          <Input
            name="user-password-check"
            type={"password"}
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            양씨인간을 환영하십니까 ?
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            회원가입 완료
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

// 프론트 서버에서 백엔드로 쿠키 전달
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      console.log("getServerSideProps start");
      console.log("context", req);
      const cookie = req ? req.headers.cookie : "";
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      await store.dispatch(loadMyInfo());
      return {
        props: {},
      };
    }
);

export default Signup;
