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
  getProfileForMessage,
  getSimpleProfileForMessage,
} from "../hooks/profileFunction";
import type { ProfileType } from "../hooks/profileFunction";
import Context from "../store/context";

export default function Message() {
  const { accountState, accountDispatch } = useContext(Context);

  const [imgUrl, setImgUrl] = useState("");
  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false);
  const [friendList, setFriendList] = useState<any[]>([]);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImgUrl, setUserImgUrl] = useState("");
  const [myImgUrl, setMyImgUrl] = useState("");
  const [messageListId, setMessageListId] = useState<string>("");
  const [messageMemberList, setMessageMemberList] = useState<any[]>([]);
  const [myUserId, setMyUserId] = useState("");
  const [profile, setProfile] = useState<ProfileType>();
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

      // get profile
      const imageUrlForUnknown = process.env
        .NEXT_PUBLIC_UNKNOWN_IMAGE_URL as string;
      const result = await getProfileForMessage({
        api: accountState.api!,
        userId: accountState.currentAccount!.address,
        setImgUrl: setImgUrl,
        setMyImgUrl: setMyImgUrl,
        setFriendList: setFriendList,
        setProfile: setProfile,
      });
      setMyImgUrl(
        result.profile?.imgUrl == null
          ? imageUrlForUnknown
          : result.profile.imgUrl
      );
      setImgUrl(
        result.profile?.imgUrl == null
          ? imageUrlForUnknown
          : result.profile.imgUrl
      );
      setFriendList(
        result.profile?.friendList == null ? [] : result.profile.friendList
      );
      setProfile(result.profile);

      // create message member list UI
      await createMessageMemberList();

      await balanceOf({
        api: accountState.api,
        actingAccount: accountState.currentAccount!,
        setBalance: setBalance,
      });

      if (isCreatedFnRun) {
        return;
      }

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
  }, [accountState]);

  // create message member list UI
  const createMessageMemberList = async () => {
    let memberList: Array<any> = new Array();
    for (var i = 0; i < friendList.length; i++) {
      let friendProfile = (await getSimpleProfileForMessage({
        api: accountState.api,
        userId: friendList[i],
      })) as any;
      let idList = profile?.messageListIdList;
      let lastMessage: string | undefined;
      let messageList = await getMessageList({
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
          name={friendProfile?.name!}
          img_url={friendProfile?.imgUrl}
          last_message={lastMessage}
          setShowMessageModal={setShowMessageModal}
          setUserName={setUserName}
          setUserImgUrl={setUserImgUrl}
          setMyImgUrl={setMyImgUrl}
          messageListId={idList![i]}
          setMessageListId={setMessageListId}
          setMessageList={setMessageList}
          messageList={messageList}
          getMessageList={getMessageList}
          setMyUserId={setMyUserId}
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
          imgUrl={imgUrl}
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
      myImgUrl={myImgUrl}
      myUserId={myUserId}
      api={accountState.api!}
      actingAccount={accountState.currentAccount!}
      messageListId={messageListId!}
      messageList={messageList!}
    />
  );
}
