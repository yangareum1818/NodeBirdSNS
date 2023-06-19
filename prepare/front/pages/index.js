import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post
  );

  // 첫 로딩, 화면 시 데이터 불러오기
  useEffect(() => {
    console.log("first");
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  // 스크롤을 어느정도 내렸을 때, 데이터 불러오기
  useEffect(() => {
    console.log("rolling");
    const onScroll = () => {
      console.log(
        window.scrollY,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight
      );

      if (
        hasMorePosts &&
        !loadPostsLoading &&
        window.scrollY + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300
      ) {
        dispatch({
          type: LOAD_POSTS_REQUEST,
          // data: mainPosts[mainPosts.length - 1].id,
        });
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
export default Home;
