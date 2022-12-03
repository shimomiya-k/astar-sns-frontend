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
  getProfile,
} from "../hooks/profileFunction";
import Context from "../store/context";

export default function Profile(props: any) {
  const { accountState, accountDispatch, myProfileState, myProfileDispatch } =
    useContext(Context);

  const [individualPostList, setIndividualPostList] = useState<PostType[]>([]);
  const [followingList, setFollowingList] = useState<Array<string>>([]);
  const [followerList, setFollowerList] = useState<Array<string>>([]);
  const [balance, setBalance] = useState<string>("0");

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const loadAccount = async () => {
    let api = accountState.api;
    let accounts = accountState.accounts;
    let currentAccount = accountState.currentAccount;

    // 各ステートが存在する場合は何もしない
    if (api && accounts.length > 0 && currentAccount) {
      return;
    }

    // Apiオブジェクトが存在しない場合は初期化をする
    if (!api) {
      api = await connectedApi();
    }

    // 接続中のアカウントがない場合は接続する
    if (!accountState.currentAccount) {
      accounts = await connectToContract();
    }

    accountDispatch({
      type: "UPDATE_ACCOUNT_STATE",
      state: {
        api,
        accounts,
        currentAccount: accounts[0],
      },
    });
    return;
  };

  // ウォレット情報の読み込み
  useEffect(() => {
    // ３回呼ばれるて３回目で値が入る
    loadAccount();
  }, [accountState]);

  // Read系を呼び出し
  useEffect(() => {
    if (!accountState.currentAccount) {
      return;
    }

    // 現在の残高取得
    balanceOf({
      api: accountState.api,
      actingAccount: accountState.currentAccount!,
      setBalance: setBalance,
    });

    getIndividualPost({
      api: accountState.api,
      actingAccount: accountState.currentAccount,
      setIndividualPostList: setIndividualPostList,
    }).then((value) => {
      setIndividualPostList(value);
    });

    getFollowingList({
      api: accountState.api,
      userId: accountState.currentAccount?.address,
      setFollowingList: setFollowingList,
    }).then((value) => {
      setFollowingList(value);
    });

    getFollowerList({
      api: accountState.api,
      userId: accountState.currentAccount?.address,
      setFollowerList: setFollowerList,
    }).then((value) => {
      setFollowerList(value);
    });
  }, [accountState.currentAccount]);

  // ユーザー情報の取得
  useEffect(() => {
    if (!accountState.currentAccount) {
      return;
    }

    const main = async () => {
      // プロフィール情報の取得と初期化
      // 既に初期化が済んでいる場合は何もしない
      const profile = await getProfile(
        accountState.api!,
        accountState.currentAccount!.address!
      );

      if (profile) {
        myProfileDispatch({ type: "UPDATE_PROFILE", profile: { ...profile } });
        return;
      }

      const result = await checkCreatedInfo({
        api: accountState.api,
        userId: accountState.currentAccount!.address,
      });

      if (result || isCreatingProfile) {
        return false;
      }

      setIsCreatingProfile(true);

      await createProfile({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
        callback: (result) => {
          if (result.isCompleted) {
            setIsCreatingProfile(false);
          }
        },
      });
    };

    main();
  }, [accountState.currentAccount, isCreatingProfile]);

  return (
    <div className="flex justify-center items-center w-screen h-screen relative light">
      <main className="items-center w-screen h-screen max-w-4xl flex  flex-col">
        <ProfileSettingModal
          isOpen={showSettingModal}
          afterOpenFn={setShowSettingModal}
          api={accountState.api}
          userId={accountState.currentAccount?.address}
          actingAccount={accountState.currentAccount}
        />
        <TopBar
          idList={accountState.accounts}
          imgUrl={myProfileState.imgUrl}
          balance={balance}
        />
        <ProfileSubTopBar
          imgUrl={myProfileState.imgUrl!}
          name={myProfileState.name}
          followingList={followingList}
          followerList={followerList}
          isOpenModal={setShowSettingModal}
          idList={accountState.accounts}
          api={accountState.api!}
          actingAccount={accountState.currentAccount!}
        />
        <div className="flex-1 overflow-scroll">
          {individualPostList.map((post) => (
            <Post
              key={post.createdTime}
              name={post.name}
              time={post.createdTime}
              description={post.description}
              num_of_likes={post.numOfLikes}
              user_img_url={myProfileState.imgUrl}
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
