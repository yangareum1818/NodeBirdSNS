import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { END } from "redux-saga";

import { Card, Avatar } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST, loadUser } from "../reducers/user";

const About = () => {
  const { userInfo } = useSelector((state) => state.user);
  console.log("userInfo", userInfo);
  return (
    <AppLayout>
      <Head>
        <title>yangareum | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹쨱
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로잉
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[8]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아"
          />
        </Card>
      ) : (
        console.log("null")
      )}
    </AppLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (context) => {
    console.log("getstaticProps Start");
    await store.dispatch(loadUser(1));
  }
);

export default About;
