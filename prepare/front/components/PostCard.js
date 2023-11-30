import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Avatar, Button, Card, Comment, List, Popover } from "antd";
import {
  RetweetOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import moment from "moment";

import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {
  REMOVE_POST_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
  likePost,
  unlikePost,
  removePost,
  retweet,
} from "../reducers/post";
import FollowButton from "./FollowButton";

moment.locale("ko");

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  // 옵셔널 체이닝
  const id = useSelector((state) => state.user.me?.id); // 나의 id를 찾는다.
  // 방법은 다양하다. ( 옵셔널을 사용하지 않은 2가지 방법 )
  // 1. const id = useSelector((state) => state.user.me && state.user.me.id)
  // 2. const { me } = useSelector((state) => state.user)
  // 2. const id = me?.id;

  console.log("id", id, removePostLoading);

  const onLike = useCallback(() => {
    if (!id) return alert("로그인이 필요합니다.");
    return dispatch(likePost(post.id));
  }, [id]);
  const onUnLike = useCallback(() => {
    if (!id) return alert("로그인이 필요합니다.");
    return dispatch(unlikePost(post.id));
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) return alert("로그인이 필요합니다.");
    return dispatch(removePost(post.id));
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) return alert("로그인이 필요합니다.");
    return dispatch(retweet(post.id));
  }, [id]);

  // 좋아요누른사람 데이터 가져오기 ( v.id : 현재 좋아요를 누른사람, DB에 저장되어있는 user.id)
  const liked = post.Likers.find((v) => v.id === id);

  return (
    <div style={{ marginBottom: "20px" }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key={"retweet"} onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              twoToneColor="eb2f96"
              key="heart"
              onClick={onUnLike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          // 더보기 ... 버튼
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      loading={removePostLoading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
      >
        {/* 현재 게시글이 리트윗 게시글이라면 (리트윗 게시글(의 객체)과 리트윗 게시글 id) */}
        {post.Retweet && post.RetweetId ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <div style={{ float: "right" }}>
              {moment(post.createdAt).format("YYYY.MM.DD")}
            </div>
            <Card.Meta
              style={{ cursor: "pointer" }}
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`} legacyBehavior>
                  <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: "right" }}>
              {moment(post.createdAt).format("YYYY.MM.DD")}
            </div>
            <Card.Meta
              style={{ cursor: "pointer" }}
              avatar={
                <Link href={`/user/${post.User.id}`} legacyBehavior>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />}
            />
          </>
        )}
      </Card>
      {commentFormOpened && (
        <div>
          {/* 댓글은 게시글에 속한다. 어떤 게시글에 댓글을 달 것인지 정보(id)가 필요하기 때문에 post를 prop으로 전달한다. */}
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  style={{ cursor: "pointer" }}
                  author={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`} legacyBehavior>
                      <Avatar>{item.User.nickname[0]}</Avatar>
                    </Link>
                  }
                  content={item.content}
                ></Comment>
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    Retweet: PropTypes.objectOf(PropTypes.any),
    RetweetId: PropTypes.number,
  }).isRequired,
};

export default PostCard;
