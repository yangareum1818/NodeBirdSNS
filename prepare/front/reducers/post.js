import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { produce } from "immer";
import _ from "lodash";
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

const loadPostsThrottle = async (lastId) => {
  const response = await axios.get(`/posts?lastId=${lastId || 0}`);
  return response.data;
};

export const loadPosts = createAsyncThunk(
  "post/loadPosts",
  _.throttle(loadPostsThrottle, 5000)
);

const loadHashtagPostsThrottle = async ({ lastId, tag }) => {
  const response = await axios.get(
    `/hashtag/${encodeURIComponent(tag)}?lastId=${lastId || 0}`
  );
  return response.data;
};

export const loadHashtagPosts = createAsyncThunk(
  "post/loadHashtagPosts",
  _.throttle(loadHashtagPostsThrottle, 5000)
);

const loadUserPostsThrottle = async ({ lastId, id }) => {
  const response = await axios.get(`user/${id}/posts?lastId=${lastId || 0}`);
  return response.data;
};

export const loadUserPosts = createAsyncThunk(
  "post/loadUserPosts",
  _.throttle(loadUserPostsThrottle, 5000)
);

export const loadPost = createAsyncThunk("post/loadPost", async (data) => {
  const response = await axios.get(`/post/${data}`);
  return response.data;
});

export const retweet = createAsyncThunk("post/retweet", async (data) => {
  const response = await axios.post(`/post/${data}/retweet`);
  return response.data;
});

export const addPost = createAsyncThunk("post/addPost", async (data) => {
  const response = await axios.post("/post", data);
  return response.data;
});

export const updatePost = createAsyncThunk("post/updatePost", async (data) => {
  const response = await axios.patch(`/post/${data.PostId}`, data);
  return response.data;
});

export const removePost = createAsyncThunk("post/removePost", async (data) => {
  const response = await axios.delete(`/post/${data}`);
  return response.data;
});

export const addComment = createAsyncThunk("post/addComment", async (data) => {
  const response = await axios.post(`/post/${data.postId}/comment`, data);
  return response.data;
});

export const likePost = createAsyncThunk("post/likePost", async (data) => {
  const response = await axios.patch(`/post/${data}/like`);
  return response.data;
});

export const unlikePost = createAsyncThunk("post/unlikePost", async (data) => {
  const response = await axios.delete(`/post/${data}/like`);
  return response.data;
});

export const uploadImages = createAsyncThunk(
  "post/uploadImages",
  async (data) => {
    const response = await axios.post("/post/images", data);
    return response.data;
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    removeImages(state, action) {
      state.imagePaths = state.imagePaths.filter(
        (v, i) => i !== action.payload
      );
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(HYDRATE, (state, action) => ({
        ...state,
        ...action.payload.post,
      }))
      .addCase(loadPosts.pending, (state) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error.message;
      })
      .addCase(loadHashtagPosts.pending, (state) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadHashtagPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadHashtagPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error.message;
      })
      .addCase(loadUserPosts.pending, (state) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadUserPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadUserPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error.message;
      })
      .addCase(loadPost.pending, (state) => {
        state.loadPostLoading = true;
        state.loadPostDone = false;
        state.loadPostError = null;
      })
      .addCase(loadPost.fulfilled, (state, action) => {
        state.loadPostLoading = false;
        state.loadPostDone = true;
        state.singlePost = action.payload;
      })
      .addCase(loadPost.rejected, (state, action) => {
        state.loadPostLoading = false;
        state.loadPostError = action.error.message;
      })
      .addCase(retweet.pending, (state) => {
        state.retweetLoading = true;
        state.retweetDone = false;
        state.retweetError = null;
      })
      .addCase(retweet.fulfilled, (state, action) => {
        state.retweetLoading = false;
        state.retweetDone = true;
        state.mainPosts.unshift(action.payload);
      })
      .addCase(retweet.rejected, (state, action) => {
        state.retweetLoading = false;
        state.retweetError = action.error.message;
      })
      .addCase(addPost.pending, (draft) => {
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
      })
      .addCase(addPost.fulfilled, (draft, action) => {
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.payload);
        draft.imagePaths = [];
      })
      .addCase(addPost.rejected, (draft, action) => {
        draft.addPostLoading = false;
        draft.addPostError = action.error.message;
      })
      .addCase(updatePost.pending, (draft) => {
        draft.updatePostLoading = true;
        draft.updatePostDone = false;
        draft.updatePostError = null;
      })
      .addCase(updatePost.fulfilled, (draft, action) => {
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        draft.mainPosts.find((v) => v.id === action.payload.PostId).content =
          action.payload.content;
      })
      .addCase(updatePost.rejected, (draft, action) => {
        draft.updatePostLoading = false;
        draft.updatePostError = action.error.message;
      })
      .addCase(removePost.pending, (draft) => {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
      })
      .addCase(removePost.fulfilled, (draft, action) => {
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = mainPosts.filter(
          (v) => v.id !== action.payload.PostId
        );
      })
      .addCase(removePost.rejected, (draft, action) => {
        draft.removePostLoading = false;
        draft.removePostError = action.error.message;
      })
      .addCase(addComment.pending, (draft) => {
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
      })
      .addCase(addComment.fulfilled, (draft, action) => {
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Comment.unshift(action.payload);
      })
      .addCase(addComment.rejected, (draft, action) => {
        draft.addCommentLoading = false;
        draft.addCommentError = action.error.message;
      })
      .addCase(likePost.pending, (draft) => {
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
      })
      .addCase(likePost.fulfilled, (draft, action) => {
        draft.likePostLoading = false;
        draft.likePostDone = true;
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Likers.push({ id: action.payload.UserId });
      })
      .addCase(likePost.rejected, (draft, action) => {
        draft.likePostLoading = false;
        draft.likePostError = action.error.message;
      })
      .addCase(unlikePost.pending, (draft) => {
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
      })
      .addCase(unlikePost.fulfilled, (draft, action) => {
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Likers.filter((v) => v.id !== action.payload.UserId);
      })
      .addCase(unlikePost.rejected, (draft, action) => {
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error.message;
      })
      .addCase(uploadImages.pending, (draft) => {
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
      })
      .addCase(uploadImages.fulfilled, (draft, action) => {
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.imagePaths = draft.imagePaths.concat(action.payload);
      })
      .addCase(uploadImages.rejected, (draft, action) => {
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error.message;
      }),
});

export default postSlice;
