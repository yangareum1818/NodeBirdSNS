import { createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";
import { HYDRATE } from "next-redux-wrapper";

// data를 어떻게 받을건지 백엔드, 서버개발자와 의논 & 원하는 데이터 객체형식을 말해도됌. (리덕스 데이터 구조)
// db의 시퀄라이즈 : 다른 데이터와 합쳐서 주게 되어 앞글자가 대문자이다.
export const initialState = {
  mainPosts: [],
  singlePost: null,
  imagePaths: [],
  hasMorePosts: true,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false,
  retweetDone: false,
  retweetError: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(HYDRATE, (state, action) => ({
      ...state,
      ...action.payload.post,
    })),
});

export default postSlice;
