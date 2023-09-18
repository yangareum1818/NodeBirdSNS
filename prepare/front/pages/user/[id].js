import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import { Avatar, Card, Empty } from "antd";

import wrapper from "../../store/configureStore";
import Head from "next/head";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { LOAD_USER_POSTS_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from "../../reducers/user";

// 특정 사용자의 게시글 불러오기
const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { userInfo, me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  // 스크롤을 어느정도 내렸을 때, 데이터 불러오기
  useEffect(() => {
    const onScroll = () => {
      if (
        hasMorePosts &&
        !loadPostsLoading &&
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300
      ) {
        // 마지막 게시글의 id (게시글이 0개일 경우. 즉, undefined인 경우를 대비해 옵셔널체이닝)
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
          type: LOAD_USER_POSTS_REQUEST,
          lastId,
          data: id,
        });
      }
    };

    window.addEventListener("scroll", onScroll);
    // removeEventListener를 해줘야 데이터가 쌓여있지 않는다.
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, id, mainPosts.length, loadPostsLoading]);

  console.log(userInfo, me);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>{userInfo.nickname}님의 글</title>
          <meta
            name="description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:title"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta property="og:image" content={`%PUBLIC_URL%/favicon.ico`} />
          <meta propert="og:url" content={`https://nodebird.com/post/${id}`} />
        </Head>
      )}
      {userInfo && userInfo.id !== me?.id ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : (
        <Empty
          style={{
            margin: "10px 0",
            padding: "20px 0",
            border: "1px solid #eee",
            borderRadius: "15px",
          }}
          description={"존재하지 않는 사용자입니다."}
        />
      )}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// 프론트 서버에서 백엔드로 쿠키 전달
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const cookie = req ? req.headers.cookie : "";
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: params.id,
      });
      store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
      store.dispatch({
        type: LOAD_USER_REQUEST,
        data: params.id,
      });
      store.dispatch(END);
      await store.sagaTask.toPromise();
    }
);
export default User;
