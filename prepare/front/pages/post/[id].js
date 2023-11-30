import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import Head from "next/head";
import axios from "axios";

import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST, loadMyInfo } from "../../reducers/user";
import { LOAD_POST_REQUEST, loadPost } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";

// post/[id].js
const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>NodeBird | {singlePost.User.nickname}님의 글</title>
        <meta name="description" content={singlePost.content} />
        <meta
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : `%PUBLIC_URL%/favicon.ico`
          }
        />
        <meta propert="og:url" content={`https://nodebird.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, params }) => {
      const cookie = req ? req.headers.cookie : "";
      axios.defaults.headers.Cookie = "";
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      // console.log("req", req);
      await store.dispatch(loadMyInfo());
      await store.dispatch(loadPost(params.id));

      return {
        props: {},
      };
    }
);
export default Post;
