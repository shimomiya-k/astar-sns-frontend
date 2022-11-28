import { ApiPromise } from "@polkadot/api";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { useEffect, useState } from "react";

import { PostButton } from "../components/atoms/postButton";
import BottomNavigation from "../components/bottomNavigation";
import Post from "../components/post";
import PostModal from "../components/postModal";
import TopBar from "../components/topBar";
import { connectToContract } from "../hooks/connect";
import { balanceOf, distributeReferLikes, transfer } from "../hooks/FT";
import type { PostType } from "../hooks/postFunction";
import { getGeneralPost } from "../hooks/postFunction";
import {
  checkCreatedInfo,
  createProfile,
  getProfileForHome,
} from "../hooks/profileFunction";

export default function Home() {
  const [api, setApi] = useState<ApiPromise>();

  const [isCreatedProfile, setIsCreatedProfile] = useState(true);
  const [isCreatedFnRun, setIsCreatedFnRun] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isDistributed, setIsDistributed] = useState(false);

  const [imgUrl, setImgUrl] = useState<string>("");
  const [accountList, setAccountList] = useState<InjectedAccountWithMeta[]>([]);
  const [actingAccount, setActingAccount] = useState<InjectedAccountWithMeta>();
  const [generalPostList, setGeneralPostList] = useState<PostType[]>([]);
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

      let imageUrl = imgUrl;
      if (!imgUrl || imgUrl === "") {
        console.log("getProfileForHome");
        imageUrl = await getProfileForHome({
          api: api!,
          userId: actingAccount?.address!,
          setImgUrl: setImgUrl,
        });
      }

      if (imgUrl === "" && imageUrl !== "") {
        setImgUrl(imageUrl);
        return;
      }

      console.log("balanceOf");
      await balanceOf({
        api: api,
        actingAccount: actingAccount!,
        setBalance: setBalance,
      });

      console.log("getGeneralPost");
      await getGeneralPost({
        api: api!,
        setGeneralPostList: setGeneralPostList,
      });

      console.log(`isDistributed: ${isDistributed}`);
      if (isDistributed) {
        return;
      }

      console.log("distributeReferLikes");
      await distributeReferLikes({
        api: api,
        actingAccount: actingAccount!,
      });

      setIsDistributed(true);

      console.log(`isCreatedFnRun: ${isCreatedFnRun}`);
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

      console.log("createProfile");
      await createProfile({ api: api, actingAccount: actingAccount! });
      setIsCreatedFnRun(true);
    };

    main();
  }, [imgUrl, isSetup]);

  return (
    <div className="flex justify-center items-center w-screen h-screen relative">
      <main className="items-center justify-center w-screen h-screen max-w-4xl flex flex-col">
        <PostModal
          isOpen={showNewPostModal}
          afterOpenFn={setShowNewPostModal}
          api={api!}
          actingAccount={actingAccount!}
        />
        <TopBar
          idList={accountList}
          imgUrl={imgUrl}
          setActingAccount={setActingAccount}
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
              actingAccount={actingAccount}
              api={api}
            />
          ))}
        </div>
        <div className="w-full">
          <BottomNavigation api={api} />
        </div>
        <PostButton setShowNewPostModal={setShowNewPostModal} />
      </main>
    </div>
  );
}
