import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST,
} from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { END } from "redux-saga";

import wrapper from "../../store/configureStore";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query; // id가 아닌 tag를 가져온다.
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

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
          data: tag,
        });
      }
    };

    window.addEventListener("scroll", onScroll);
    // removeEventListener를 해줘야 데이터가 쌓여있지 않는다.
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, tag, mainPosts.length, loadPostsLoading]);

  return (
    <AppLayout>
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
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: params.tag,
      });
      store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
      store.dispatch(END);
      await store.sagaTask.toPromise();
    }
);
export default Hashtag;
