import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { END } from "redux-saga";
import axios from "axios";
import useSWR from "swr";

import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";
import { LOAD_MY_INFO_REQUEST, loadMyInfo } from "../reducers/user";
import wrapper from "../store/configureStore";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const {
    data: followersData,
    error: followerError,
    isLoading: followerLoadinng,
  } = useSWR(
    `http://localhost:3065/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const {
    data: followingsData,
    error: followingError,
    isLoading: followingLoading,
  } = useSWR(
    `http://localhost:3065/user/followings?limit=${followingsLimit}`,
    fetcher
  );

  useEffect(() => {
    if (!(me && me.id)) Router.push("/");
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (followerError || followingError) {
    console.error(followerError, followingError);
    return <div>팔로잉 / 팔로워 로딩중 에러가 발생했습니다.</div>;
  }

  if (!me) return <div>내 정보 로딩중 ...</div>;

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList
          header="팔로잉"
          data={followingsData}
          onClickMore={loadMoreFollowings}
          loading={followingLoading}
        />
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={followerLoadinng}
        />
      </AppLayout>
    </>
  );
};

// 프론트 서버에서 백엔드로 쿠키 전달
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    console.log("getServerSideProps start");
    console.log("context", context);
    const cookie = context.req ? context.req.headers.cookie : "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    await store.dispatch(loadMyInfo());
  }
);

export default Profile;
