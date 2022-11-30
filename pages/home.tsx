import { ApiPromise } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useContext, useEffect, useState } from "react";

import { PostButton } from "../components/atoms/postButton";
import BottomNavigation from "../components/bottomNavigation";
import Post from "../components/post";
import PostModal from "../components/postModal";
import TopBar from "../components/topBar";
import { connectedApi, connectToContract } from "../hooks/connect";
import { balanceOf, distributeReferLikes, transfer } from "../hooks/FT";
import type { PostType } from "../hooks/postFunction";
import { getGeneralPost } from "../hooks/postFunction";
import {
  checkCreatedInfo,
  createProfile,
  getProfile,
  getProfileForHome,
} from "../hooks/profileFunction";
import Context from "../store/context";

export default function Home() {
  const { accountState, accountDispatch, myProfileState, myProfileDispatch } =
    useContext(Context);

  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isDistributed, setIsDistributed] = useState(false);

  const [generalPostList, setGeneralPostList] = useState<PostType[]>([]);
  const [balance, setBalance] = useState<string>("0");

  const loadAccount = async (): Promise<boolean> => {
    // Apiオブジェクトが存在しない場合は初期化をする
    if (!accountState.api) {
      const api = await connectedApi();
      accountDispatch({ type: "UPDATE_API", api });
      return false;
    }

    // 接続中のアカウントがない場合は接続する
    if (!accountState.currentAccount) {
      const accounts = await connectToContract();
      accountDispatch({ type: "UPDATE_ACCOUNTS", accounts });
      return false;
    }

    return true;
  };

  const initialProfile = async () => {
    if (myProfileState.userId) {
      return;
    }

    const profile = await getProfile(
      accountState.api!,
      accountState.currentAccount!.address!
    );

    if (profile) {
      myProfileDispatch({ type: "UPDATE_PROFILE", profile: { ...profile } });
    }
  };

  useEffect(() => {
    const main = async () => {
      // アカウントの読み込みが完了しない場合は次の処理へ進めない
      const next = await loadAccount();
      if (!next) {
        return;
      }

      // プロフィール情報の取得と初期化
      // 既に初期化が済んでいる場合は何もしない
      await initialProfile();

      await balanceOf({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
        setBalance: setBalance,
      });

      await getGeneralPost({
        api: accountState.api!,
        setGeneralPostList: setGeneralPostList,
      });

      if (isDistributed) {
        return;
      }

      await distributeReferLikes({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
      });

      setIsDistributed(true);

      if (isCreatedFnRun) {
        return;
      }

      const exists = await checkCreatedInfo({
        api: accountState.api,
        userId: accountState.currentAccount!.address!,
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
  }, [accountState]);

  return (
    <div className="flex justify-center items-center w-screen h-screen relative">
      <main className="items-center justify-center w-screen h-screen max-w-4xl flex flex-col">
        <PostModal
          isOpen={showNewPostModal}
          afterOpenFn={setShowNewPostModal}
          api={accountState.api!}
          actingAccount={accountState.currentAccount!}
        />
        <TopBar
          idList={accountState.accounts}
          imgUrl={myProfileState.imgUrl}
          setActingAccount={accountState.currentAccount}
          balance={balance}
        />
        <div className="flex-1 overflow-scroll">
          {generalPostList.map((post) => (
            <Post
              key={post.createdTime}
              name={post.name}
              time={post.createdTime}
              description={post.description}
              num_of_likes={post.numOfLikes}
              user_img_url={post.userImgUrl}
              post_img_url={post.imgUrl}
              userId={post.userId}
              postId={post.postId}
              actingAccount={accountState.currentAccount}
              api={accountState.api}
            />
          ))}
        </div>
        <div className="w-full">
          <BottomNavigation api={accountState.api} />
        </div>
        <PostButton setShowNewPostModal={setShowNewPostModal} />
      </main>
    </div>
  );
}
