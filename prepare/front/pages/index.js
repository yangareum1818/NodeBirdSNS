import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { loadPosts } from "../reducers/post";
import { loadMyInfo } from "../reducers/user";
import wrapper from "../store/configureStore";

const Home = (props) => {
  console.log("props", props);
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);

  useEffect(() => {
    console.log(retweetError);
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  const lastId = mainPosts[mainPosts.length - 1]?.id;
  // 스크롤을 어느정도 내렸을 때, 데이터 불러오기
  useEffect(() => {
    console.log("rolling");
    const onScroll = () => {
      // console.log(
      //   window.scrollY,
      //   document.documentElement.clientHeight,
      //   document.documentElement.scrollHeight
      // );

      if (
        hasMorePosts &&
        !loadPostsLoading &&
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300
      ) {
        dispatch(loadPosts(lastId));
      }
    };

    window.addEventListener("scroll", onScroll);
    // removeEventListener를 해줘야 데이터가 쌓여있지 않는다.
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {/* key 값은 index를 넣지 않는다. 다만, 반복문안에서 데이터가 바뀌지 않는다면 사용해도 괜찮다. */}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
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
    await store.dispatch(loadPosts());
    await store.dispatch(loadMyInfo());
    console.log("state", store.getState());
  }
);
export default Home;
