import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { produce } from "immer";
import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  loadUserLoading: false, // 유저 정보 가져오기 시도중
  loadUserDone: false,
  loadUserError: null,
  loadMyInfoLoading: false, // 내 정보 가져오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  loadFollowersLoading: false, // 팔로워 목록 불러오기 시도중
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsLoading: false, // 팔로잉 목록 불러오기 시도중
  loadFollowingsDone: false,
  loadFollowingsError: null,
  removeFollowerLoading: false, // 팔로워 차단 시도중
  removeFollowerDone: false,
  removeFollowerError: null,
  me: null,
  userInfo: null,
};

export const logIn = createAsyncThunk("user/logIn", async (data) => {
  const response = await axios.post("/user/login", data);
  return response.data;
});

export const logOut = createAsyncThunk("user/logOut", async () => {
  const response = await axios.post("/user/logout");
  return response.data;
});

export const signup = createAsyncThunk("user/signup", async () => {
  const response = await axios.post("/user/signup");
  return response.data;
});

export const loadMyInfo = createAsyncThunk("user/loadMyInfo", async () => {
  const response = await axios.get("/user");
  console.log("=> (user.js:65) response", response.data);
  return response.data || null;
});

export const changeNickname = createAsyncThunk(
  "user/changeNickname",
  async (data) => {
    const response = await axios.patch("/user/nickname", { nickname: data });
    return response.data;
  }
);

export const follow = createAsyncThunk("user/follow", async (data) => {
  const response = await axios.patch(`/user/${data}/follow`);
  return response.data;
});

export const unfollow = createAsyncThunk("user/unfollow", async (data) => {
  const response = await axios.delete(`/user/${data}/follow`);
  return response.data;
});

export const loadFollowings = createAsyncThunk(
  "user/loadFollowings",
  async (data) => {
    const response = await axios.get("/user/followings", data);
    return response.data;
  }
);

export const loadFollowers = createAsyncThunk(
  "user/loadFollowers",
  async (data) => {
    const response = await axios.get("/user/followers", data);
    return response.data;
  }
);

export const loadUser = createAsyncThunk("user/loadUser", async (data) => {
  const response = await axios.get(`/user/${data}`);
  return response.data;
});

export const removeFollower = createAsyncThunk(
  "user/removeFollower",
  async (data) => {
    const response = await axios.delete(`/user/follower/${data}`);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPostToMe(draft, action) {
      draft.me.Posts.unshift({ id: action.payload });
    },
    removePostOfMe(draft, action) {
      draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.payload);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(HYDRATE, (state, action) => ({
        ...state,
        ...action.payload.user,
      }))
      .addCase(logIn.pending, (state) => {
        state.logInLoading = true;
        state.logInError = false;
        state.logInDone = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.logInLoading = false;
        state.me = action.payload;
        state.logInDone = true;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.logInLoading = false;
        state.logInError = action.error.message;
      })
      .addCase(logOut.pending, (draft) => {
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = null;
      })
      .addCase(logOut.fulfilled, (draft) => {
        draft.logOutLoading = false;
        draft.logOutDone = true;
      })
      .addCase(logOut.rejected, (draft, action) => {
        draft.logOutLoading = false;
        draft.logOutError = action.error.message;
      })
      .addCase(signup.pending, (draft) => {
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = null;
      })
      .addCase(signup.fulfilled, (draft) => {
        draft.signUpLoading = false;
        draft.signUpDone = true;
      })
      .addCase(signup.rejected, (draft, action) => {
        draft.signUpLoading = false;
        draft.signUpError = action.error.message;
      })
      .addCase(loadMyInfo.pending, (draft) => {
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoDone = false;
        draft.loadMyInfoError = null;
      })
      .addCase(loadMyInfo.fulfilled, (draft, action) => {
        draft.loadMyInfoLoading = false;
        draft.me = action.payload || null;
        draft.loadMyInfoDone = true;
      })
      .addCase(loadMyInfo.rejected, (draft, action) => {
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error.message;
      })
      .addCase(changeNickname.pending, (draft) => {
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
      })
      .addCase(changeNickname.fulfilled, (draft, action) => {
        draft.changeNicknameLoading = false;
        draft.me.nickname = action.payload.nickname;
        draft.changeNicknameDone = true;
      })
      .addCase(changeNickname.rejected, (draft, action) => {
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error.message;
      })
      .addCase(follow.pending, (draft) => {
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
      })
      .addCase(follow.fulfilled, (draft, action) => {
        draft.followLoading = false;
        draft.me.Followings.push({ id: action.payload.UserId });
        draft.followDone = true;
      })
      .addCase(follow.rejected, (draft, action) => {
        draft.followLoading = false;
        draft.followError = action.error.message;
      })
      .addCase(unfollow.pending, (draft) => {
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
      })
      .addCase(unfollow.fulfilled, (draft, action) => {
        draft.unfollowLoading = false;
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.payload.UserId
        );
        draft.unfollowDone = true;
      })
      .addCase(unfollow.rejected, (draft, action) => {
        draft.unfollowLoading = false;
        draft.unfollowError = action.error.message;
      })
      .addCase(loadFollowings.pending, (draft) => {
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsError = null;
      })
      .addCase(loadFollowings.fulfilled, (draft, action) => {
        draft.loadFollowingsLoading = false;
        draft.me.Followings = action.payload;
        draft.loadFollowingsDone = true;
      })
      .addCase(loadFollowings.rejected, (draft, action) => {
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = action.error.message;
      })
      .addCase(loadFollowers.pending, (draft) => {
        draft.loadFollowersLoading = true;
        draft.loadFollowersDone = false;
        draft.loadFollowersError = null;
      })
      .addCase(loadFollowers.fulfilled, (draft, action) => {
        draft.loadFollowersLoading = false;
        draft.me.Followers = action.payload;
        draft.loadFollowersDone = true;
      })
      .addCase(loadFollowers.rejected, (draft, action) => {
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = action.error.message;
      })
      .addCase(loadUser.pending, (draft) => {
        draft.loadUserLoading = true;
        draft.loadUserDone = false;
        draft.loadUserError = null;
      })
      .addCase(loadUser.fulfilled, (draft, action) => {
        draft.loadUserLoading = false;
        draft.UserId = action.payload;
        draft.loadUserDone = true;
      })
      .addCase(loadUser.rejected, (draft, action) => {
        draft.loadUserLoading = false;
        draft.loadUserError = action.error.message;
      })
      .addCase(removeFollower.pending, (draft) => {
        draft.removeFollowerLoading = true;
        draft.removeFollowerDone = false;
        draft.removeFollowerError = null;
      })
      .addCase(removeFollower.fulfilled, (draft, action) => {
        draft.removeFollowerLoading = false;
        draft.me.Followers = draft.me.Followers.filter(
          (v) => v.id !== action.payload.UserId
        );
        draft.removeFollowerDone = true;
      })
      .addCase(removeFollower.rejected, (draft, action) => {
        draft.removeFollowerLoading = false;
        draft.removeFollowerError = action.error.message;
      })
      .addDefaultCase((state) => state),
});

export default userSlice;
