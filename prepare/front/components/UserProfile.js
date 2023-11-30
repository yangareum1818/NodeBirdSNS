import React, { useCallback } from "react";
import Link from "next/link";
import { Avatar, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logOut, logoutRequestAction } from "../reducers/user";

const UserProfile = () => {
  const dispatch = useDispatch({});
  const { me, logOutLoading } = useSelector((state) => state.user);

  const onLogOut = useCallback(() => {
    dispatch(logOut());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`} legacyBehavior>
            짹쨱
            <br />
            {me.Posts.length}
          </Link>
        </div>,
        <div key="followings">
          <Link href="/profile" legacyBehavior>
            팔로잉
            <br />
            {me.Followings.length}
          </Link>
        </div>,
        <div key="followings">
          <Link href="/profile" legacyBehavior>
            팔로워
            <br />
            {me.Followers.length}
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={
          <Link href={`/user/${me.id}`} legacyBehavior>
            <Avatar>{me.nickname[0]}</Avatar>
          </Link>
        }
        title={me.nickname}
      />
      <Button onClick={onLogOut} loading={logOutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};
export default UserProfile;
