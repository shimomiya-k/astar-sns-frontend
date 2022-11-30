import { ApiPromise } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useContext, useEffect, useState } from "react";

import BottomNavigation from "../components/bottomNavigation";
import Post from "../components/post";
import ProfileSettingModal from "../components/profileSettingModal";
import ProfileSubTopBar from "../components/profileSubTopBar";
import TopBar from "../components/topBar";
import { connectedApi, connectToContract } from "../hooks/connect";
import { balanceOf } from "../hooks/FT";
import type { PostType } from "../hooks/postFunction";
import { getIndividualPost } from "../hooks/postFunction";
import {
  checkCreatedInfo,
  createProfile,
  getFollowerList,
  getFollowingList,
  getProfileForProfile,
} from "../hooks/profileFunction";
import Context from "../store/context";

export default function Profile(props: any) {
  const { accountState, accountDispatch } = useContext(Context);

  const [imgUrl, setImgUrl] = useState("");
  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false);
  const [name, setName] = useState("");
  const [individualPostList, setIndividualPostList] = useState<PostType[]>([]);

  const [showSettingModal, setShowSettingModal] = useState(false);
  const [followingList, setFollowingList] = useState<Array<string>>([]);
  const [followerList, setFollowerList] = useState<Array<string>>([]);
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const main = async () => {
      // Apiオブジェクトが存在しない場合は初期化をする
      if (!accountState.api) {
        const api = await connectedApi();
        accountDispatch({ type: "UPDATE_API", api });
        return;
      }

      // 接続中のアカウントがない場合は接続する
      if (!accountState.currentAccount) {
        const accounts = await connectToContract();
        accountDispatch({ type: "UPDATE_ACCOUNTS", accounts });
        return;
      }

      const profile = await getProfileForProfile({
        api: accountState.api,
        userId: accountState.currentAccount!.address,
        setImgUrl: setImgUrl,
        setName: setName,
      });

      setImgUrl(profile.imgUrl);
      setName(profile.name);

      const postListResult = await getIndividualPost({
        api: accountState.api,
        actingAccount: accountState.currentAccount,
        setIndividualPostList: setIndividualPostList,
      });

      setIndividualPostList(postListResult);

      const followingListResult = await getFollowingList({
        api: accountState.api,
        userId: accountState.currentAccount?.address,
        setFollowingList: setFollowingList,
      });

      setFollowingList(followingListResult);

      const followerListResult = await getFollowerList({
        api: accountState.api,
        userId: accountState.currentAccount?.address,
        setFollowerList: setFollowerList,
      });

      setFollowerList(followerListResult);

      await balanceOf({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
        setBalance: setBalance,
      });

      if (isCreatedFnRun) {
        return;
      }

      console.log("checkCreatedInfo");
      const exists = await checkCreatedInfo({
        api: accountState.api,
        userId: accountState.currentAccount?.address!,
        setIsCreatedProfile: setIsCreatedProfile,
      });

      if (exists) {
        setIsCreatedProfile(exists);
        setIsCreatedFnRun(true);
        return;
      }

      await createProfile({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
      });
      setIsCreatedFnRun(true);
    };

    main();
  }, [accountState, name, imgUrl]);

  return (
    <div className="flex justify-center items-center w-screen h-screen relative light">
      <main className="items-center w-screen h-screen max-w-4xl flex  flex-col">
        <ProfileSettingModal
          isOpen={showSettingModal}
          afterOpenFn={setShowSettingModal}
          api={accountState.api}
          userId={accountState.currentAccount?.address}
          setImgUrl={setImgUrl}
          setName={setName}
          actingAccount={accountState.currentAccount}
        />
        <TopBar
          idList={accountState.accounts}
          imgUrl={imgUrl}
          balance={balance}
        />
        <ProfileSubTopBar
          imgUrl={imgUrl}
          name={name}
          followingList={followingList}
          followerList={followerList}
          isOpenModal={setShowSettingModal}
          idList={accountState.accounts}
          api={accountState.api!}
          actingAccount={accountState.currentAccount!}
          setIsCreatedFnRun={setIsCreatedFnRun}
        />
        <div className="flex-1 overflow-scroll">
          {individualPostList.map((post) => (
            <Post
              key={post.createdTime}
              name={post.name}
              time={post.createdTime}
              description={post.description}
              num_of_likes={post.numOfLikes}
              user_img_url={imgUrl}
              post_img_url={post.imgUrl}
            />
          ))}
        </div>
        <div className="w-full">
          <BottomNavigation />
        </div>
      </main>
    </div>
  );
}
