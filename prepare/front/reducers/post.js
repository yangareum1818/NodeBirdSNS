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
          src: "https://images.pexels.com/photos/16747504/pexels-photo-16747504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          src: "https://images.pexels.com/photos/16721380/pexels-photo-16721380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          src: "https://images.pexels.com/photos/16847901/pexels-photo-16847901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          src: "https://images.pexels.com/photos/15206453/pexels-photo-15206453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          src: "https://images.pexels.com/photos/16159222/pexels-photo-16159222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "areum Yang",
          },
          content: "글이 너무너무 좋네요 - !",
        },
        {
          User: { nickname: "taco" },
          content: "감성 가득 이미지 ~",
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = "ADD_POST";
export const addPost = {
  type: ADD_POST,
};
const dummyPost = {
  id: 2,
  content: "dummy yammy",
  User: {
    id: 1,
    nickname: "아르미",
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      console.log(...state.mainPosts);
      // dummyPost를 앞쪽에 적어줘야 게시글 보다 위에 나타난다.
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};
export default reducer;
