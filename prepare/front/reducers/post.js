import shortId from "shortid";
import { produce } from "immer";
import { faker } from "@faker-js/faker";
// data를 어떻게 받을건지 백엔드, 서버개발자와 의논 & 원하는 데이터 객체형식을 말해도됌. (리덕스 데이터 구조)
// db의 시퀄라이즈 : 다른 데이터와 합쳐서 주게 되어 앞글자가 대문자이다.
export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "알음잉",
      },
      content: "알음이의 첫번째 게시글 #해시태그 #익스프레스 #바다 #건물 #풍경",
      Images: [
        {
          id: shortId.generate(),
          src: "https://images.pexels.com/photos/16747504/pexels-photo-16747504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          id: shortId.generate(),
          src: "https://images.pexels.com/photos/16721380/pexels-photo-16721380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          id: shortId.generate(),
          src: "https://images.pexels.com/photos/16847901/pexels-photo-16847901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          id: shortId.generate(),
          src: "https://images.pexels.com/photos/15206453/pexels-photo-15206453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          id: shortId.generate(),
          src: "https://images.pexels.com/photos/16159222/pexels-photo-16159222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "areum Yang",
          },
          content: "글이 너무너무 좋네요 - !",
        },
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: "taco",
          },
          content: "감성 가득 이미지 ~",
        },
      ],
    },
  ],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

faker.seed(123);
initialState.mainPosts = initialState.mainPosts.concat(
  Array(20)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.internet.userName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.url(),
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          User: {
            id: shortId.generate(),
            nickname: faker.internet.userName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }))
);

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: "아르미",
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "아르미",
  },
});

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        // dummyPost를 앞쪽에 적어줘야 게시글 보다 위에 나타난다.
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unShift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;

      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;

      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS:
        // action.data.content, postId, userId
        const post = draft.mainPosts.find((v) => v.id === action.data.postId);
        post.Comments.unShift(dummyComment(action.data.content));
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;

      // immer를 사용하면 불변성을 생각하지 않고 작성해 코드가 간략해진다.
      // const postIndex = state.mainPosts.findIndex(
      //   (v) => v.id === action.data.postId
      // );
      // const post = state.mainPosts[postIndex];
      // post.Comments = [dummyComment(action.data.content), ...post.Comments];
      // const mainPosts = [...state.mainPosts];
      // mainPosts[postIndex] = post;
      // return {
      //   ...state,
      //   addCommentLoading: false,
      //   addCommentDone: true,
      // };
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;

      default:
        return state;
    }
  });
};
export default reducer;
