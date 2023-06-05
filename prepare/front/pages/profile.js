import Head from "next/head";
import React from "react";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";

const Profile = () => {
  const followerList = [
    { nickname: "양씨인간1" },
    { nickname: "양씨인간2" },
    { nickname: "양씨인간3" },
    { nickname: "양씨인간4" },
    { nickname: "양씨인간5" },
    { nickname: "양씨인간6" },
    { nickname: "양씨인간7" },
    { nickname: "양씨인간8" },
    { nickname: "양씨인간9" },
  ];
  const followingList = [
    { nickname: "양젤리1" },
    { nickname: "양젤리2" },
    { nickname: "양젤리3" },
    { nickname: "양젤리4" },
    { nickname: "양젤리5" },
    { nickname: "양젤리6" },
    { nickname: "양젤리7" },
    { nickname: "양젤리8" },
    { nickname: "양젤리9" },
    { nickname: "양젤리10" },
  ];

  return (
    <>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={followingList} />
        <FollowList header="팔로워 목록" data={followerList} />
      </AppLayout>
    </>
  );
};
export default Profile;
