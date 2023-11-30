import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  FOLLOW_REQUEST,
  UNFOLLOW_REQUEST,
  follow,
  unfollow,
} from "../reducers/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector(
    (state) => state.user
  );
  const isFollows = me?.Followings.find((v) => v.id === post.User.id);
  const onClickButton = useCallback(() => {
    if (isFollows) {
      dispatch(unfollow(post.User.id));
    } else {
      dispatch(follow(post.User.id));
    }
  }, [isFollows]);

  // callstack 에러가 뜨기 때문에 밑에 적어준다. ( 내 게시글이면 팔로우 버튼 hiddle)
  if (post.User.id === me.id) return null;

  return (
    <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
      {isFollows ? "언팔로우" : "팔로우"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    post: PropTypes.object,
  }).isRequired,
};

export default FollowButton;
