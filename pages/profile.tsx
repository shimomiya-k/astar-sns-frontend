import { ApiPromise } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useEffect, useState } from "react";

import BottomNavigation from "../components/bottomNavigation";
import Post from "../components/post";
import ProfileSettingModal from "../components/profileSettingModal";
import ProfileSubTopBar from "../components/profileSubTopBar";
import TopBar from "../components/topBar";
import { connectToContract } from "../hooks/connect";
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

export default function Profile(props: any) {
  const [imgUrl, setImgUrl] = useState("");
  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false);
  const [name, setName] = useState("");
  const [individualPostList, setIndividualPostList] = useState<PostType[]>([]);

  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [api, setApi] = useState<ApiPromise>();
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>();
  const [followingList, setFollowingList] = useState<Array<string>>([]);
  const [followerList, setFollowerList] = useState<Array<string>>([]);
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

      const profile = await getProfileForProfile({
        api: api,
        userId: actingAccount?.address,
        setImgUrl: setImgUrl,
        setName: setName,
      });

      console.log(profile);

      setImgUrl(profile.imgUrl);
      setName(profile.name);

      const postListResult = await getIndividualPost({
        api: api,
        actingAccount: actingAccount,
        setIndividualPostList: setIndividualPostList,
      });

      setIndividualPostList(postListResult);

      const followingListResult = await getFollowingList({
        api: api,
        userId: actingAccount?.address,
        setFollowingList: setFollowingList,
      });

      setFollowingList(followingListResult);

      const followerListResult = await getFollowerList({
        api: api,
        userId: actingAccount?.address,
        setFollowerList: setFollowerList,
      });

      setFollowerList(followerListResult);

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
  }, [actingAccount, isSetup, name, imgUrl]);

  return (
    <div className="flex justify-center items-center w-screen h-screen relative light">
      <main className="items-center w-screen h-screen max-w-4xl flex  flex-col">
        <ProfileSettingModal
          isOpen={showSettingModal}
          afterOpenFn={setShowSettingModal}
          api={api}
          userId={actingAccount?.address}
          setImgUrl={setImgUrl}
          setName={setName}
          actingAccount={actingAccount}
        />
        <TopBar
          idList={accountList}
          imgUrl={imgUrl}
          setActingAccount={setActingAccount}
          balance={balance}
        />
        <ProfileSubTopBar
          imgUrl={imgUrl}
          name={name}
          followingList={followingList}
          followerList={followerList}
          isOpenModal={setShowSettingModal}
          setActingAccount={setActingAccount}
          idList={accountList}
          api={api!}
          actingAccount={actingAccount!}
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
