import { ApiPromise } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useEffect, useState } from "react";

import BottomNavigation from "../components/bottomNavigation";
import MessageMember from "../components/message_member";
import MessageRoom from "../components/messageRoom";
import TopBar from "../components/topBar";
import { connectToContract } from "../hooks/connect";
import { balanceOf } from "../hooks/FT";
import { getLastMessage, getMessageList } from "../hooks/messageFunction";
import {
  checkCreatedInfo,
  createProfile,
  getProfileForMessage,
  getSimpleProfileForMessage,
} from "../hooks/profileFunction";
import type { ProfileType } from "../hooks/profileFunction";

export default function Message() {
  // variable related to contract
  const [api, setApi] = useState<ApiPromise>();
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>();

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
  const [isSetup, setIsSetup] = useState(false);
  const [profile, setProfile] = useState<ProfileType>();
  const [balance, setBalance] = useState<string>("0");

  useEffect(() => {
    const main = async () => {
      let accounts: any[] = [];
      if (!isSetup && accountList.length === 0) {
        accounts = await connectToContract({
          api: api,
          accountList: accountList,
          actingAccount: actingAccount!,
          isSetup: isSetup,
          setApi: setApi,
          setAccountList: setAccountList,
          setActingAccount: setActingAccount!,
          setIsSetup: setIsSetup,
        });
      }

      if (!isSetup && accounts.length !== 0) {
        setAccountList(accounts);
        setActingAccount(accounts[0]);
        setIsSetup(true);
        return;
      }

      console.log(`isSetup: ${isSetup}`);
      if (!isSetup) {
        return;
      }

      // get profile
      const imageUrlForUnknown = process.env
        .NEXT_PUBLIC_UNKNOWN_IMAGE_URL as string;
      const result = await getProfileForMessage({
        api: api,
        userId: actingAccount?.address,
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
        api: api,
        actingAccount: actingAccount!,
        setBalance: setBalance,
      });

      if (isCreatedFnRun) {
        return;
      }

      console.log("checkCreatedInfo");
      const exists = await checkCreatedInfo({
        api: api,
        userId: actingAccount?.address!,
        setIsCreatedProfile: setIsCreatedProfile,
      });

      console.log(`exists: ${exists}`);
      if (exists) {
        setIsCreatedProfile(exists);
        setIsCreatedFnRun(true);
        return;
      }

      await createProfile({ api: api, actingAccount: actingAccount! });
      setIsCreatedFnRun(true);
    };

    main();
  }, [isSetup]);

  // create message member list UI
  const createMessageMemberList = async () => {
    let memberList: Array<any> = new Array();
    for (var i = 0; i < friendList.length; i++) {
      let friendProfile = (await getSimpleProfileForMessage({
        api: api,
        userId: friendList[i],
      })) as any;
      let idList = profile?.messageListIdList;
      let lastMessage: string | undefined;
      let messageList = await getMessageList({
        api: api,
        id: idList![i],
      });
      if (idList !== null) {
        lastMessage = await getLastMessage({ api: api, id: idList![i] });
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
          api={api}
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
          idList={accountList}
          imgUrl={imgUrl}
          setActingAccount={setActingAccount}
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
      api={api!}
      actingAccount={actingAccount!}
      messageListId={messageListId!}
      messageList={messageList!}
    />
  );
}
