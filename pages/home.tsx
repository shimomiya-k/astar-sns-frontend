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
} from "../hooks/profileFunction";
import Context from "../store/context";

export default function Home() {
  const { accountState, accountDispatch, myProfileState, myProfileDispatch } =
    useContext(Context);

  const [previousAddress, setPreviousAddress] = useState<string | undefined>(
    accountState.currentAccount?.address
  );
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const [generalPostList, setGeneralPostList] = useState<PostType[]>([]);
  const [balance, setBalance] = useState<string>("0");

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
    setPreviousAddress(accounts[0].address);
    return;
  };

  const updateGeneralPost = () => {
    // 全体ポストを取得する
    getGeneralPost({
      api: accountState.api!,
      setGeneralPostList: setGeneralPostList,
    });
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

    updateGeneralPost();
  }, [accountState.currentAccount, showNewPostModal]);

  useEffect(() => {
    const main = async () => {
      if (!accountState.currentAccount) {
        return;
      }

      const { address } = accountState.currentAccount;

      if (address === previousAddress) {
        return;
      }

      if (!previousAddress) {
        setPreviousAddress(accountState.currentAccount.address);
      }

      const result = await checkCreatedInfo({
        api: accountState.api,
        userId: accountState.currentAccount!.address,
      });

      if (!result) {
        return;
      }

      // ライクした投稿へトークンを送る
      distributeReferLikes({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
      });

      setPreviousAddress(accountState.currentAccount!.address);
    };

    main();
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
              updateGeneralPost={updateGeneralPost}
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
