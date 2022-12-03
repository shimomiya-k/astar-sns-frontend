import React, { useContext, useEffect, useState } from "react";

import BottomNavigation from "../components/bottomNavigation";
import MessageMember from "../components/message_member";
import MessageRoom from "../components/messageRoom";
import TopBar from "../components/topBar";
import { connectedApi, connectToContract } from "../hooks/connect";
import { balanceOf } from "../hooks/FT";
import { getLastMessage, getMessageList } from "../hooks/messageFunction";
import {
  checkCreatedInfo,
  createProfile,
  getProfile,
} from "../hooks/profileFunction";
import type { ProfileType } from "../hooks/profileFunction";
import Context from "../store/context";
import { MyProfileState } from "../state/profile";

export default function Message() {
  const { accountState, accountDispatch, myProfileState, myProfileDispatch } =
    useContext(Context);

  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImgUrl, setUserImgUrl] = useState("");
  const [messageListId, setMessageListId] = useState<string>("");
  const [messageMemberList, setMessageMemberList] = useState<any[]>([]);
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
    return;
  };

  // ウォレット情報の読み込み
  useEffect(() => {
    // ３回呼ばれるて３回目で値が入る
    loadAccount();
  }, [accountState]);

  useEffect(() => {
    if (!accountState.currentAccount) {
      return;
    }

    balanceOf({
      api: accountState.api,
      actingAccount: accountState.currentAccount!,
      setBalance: setBalance,
    });
  });

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
        refreshMessageMemberList(profile);
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

  // create message member list UI
  const refreshMessageMemberList = async (profile: MyProfileState) => {
    const { friendList } = profile;
    let memberList: Array<any> = new Array();

    console.log(profile);
    for (var i = 0; i < friendList.length; i++) {
      let friendProfile = await getProfile(accountState.api!, friendList[i]);

      const idList = profile?.messageListIdList;
      let lastMessage: string | undefined;
      const messageList = await getMessageList({
        api: accountState.api,
        id: idList![i],
      });

      if (idList !== null) {
        lastMessage = await getLastMessage({
          api: accountState.api,
          id: idList![i],
        });
      }

      let memberListFactor = (
        <MessageMember
          key={`${friendProfile!.userId}${i}`}
          name={friendProfile?.name!}
          setUserName={setUserName}
          img_url={friendProfile?.imgUrl}
          setUserImgUrl={setUserImgUrl}
          last_message={lastMessage}
          setShowMessageModal={setShowMessageModal}
          messageListId={idList![i]}
          setMessageListId={setMessageListId}
          setMessageList={setMessageList}
          messageList={messageList}
          getMessageList={getMessageList}
          myUserId={profile?.userId}
          api={accountState.api}
        />
      );
      memberList.push(memberListFactor);
    }
    setMessageMemberList(memberList);
  };

  return !showMessageModal ? (
    <div className="flex justify-center items-center w-screen h-screen relative">
      <main className="items-center w-screen h-screen max-w-4xl flex flex-col">
        <TopBar
          idList={accountState.accounts}
          imgUrl={myProfileState.imgUrl}
          setActingAccount={accountState.currentAccount}
          balance={balance}
        />
        <div className="flex-1 overflow-scroll w-full mt-1">
          {messageMemberList}
        </div>
        <div className="w-full">
          <BottomNavigation />
        </div>
      </main>
    </div>
  ) : (
    <MessageRoom
      setShowMessageModal={setShowMessageModal}
      userName={userName}
      userImgUrl={userImgUrl}
      myImgUrl={myProfileState.imgUrl}
      myUserId={myProfileState.userId!}
      api={accountState.api!}
      actingAccount={accountState.currentAccount!}
      messageListId={messageListId!}
      messageList={messageList!}
      refreshMessageMemberList={refreshMessageMemberList}
    />
  );
}
