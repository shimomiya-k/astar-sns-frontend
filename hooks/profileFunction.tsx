import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

import abi from "../metadata.json";

// type of profile in contract
export type ProfileType = {
  followingList: Array<string>;
  followerList: Array<string>;
  friendList: Array<string>;
  userId: string;
  name: string;
  imgUrl: string;
  messageListIdList: Array<number>;
  postIdList: Array<number>;
};

// type for createCheckInfo function
type PropsCCI = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setIsCreatedProfile: Dispatch<React.SetStateAction<boolean>>;
};

// type for createProoject function
type PropsCP = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
};

// type for getProfileForHome function
type PropsGPFH = {
  api: ApiPromise;
  userId: string;
  setImgUrl: Dispatch<React.SetStateAction<string>>;
};

// type for getProfileForProfile function
type PropsGPFP = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setImgUrl: Dispatch<React.SetStateAction<string>>;
  setName: Dispatch<React.SetStateAction<string>>;
};

// type for getProfileForMessage function
type PropsGPFM = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setImgUrl: Dispatch<React.SetStateAction<string>>;
  setMyImgUrl: Dispatch<React.SetStateAction<string>>;
  setFriendList: Dispatch<React.SetStateAction<string[]>>;
  setProfile: Dispatch<React.SetStateAction<ProfileType | undefined>>;
};

// type for getSimpleProfileForMessage function
type PropsGSPFM = {
  api: ApiPromise | undefined;
  userId: string | undefined;
};

// type for follow function
type PropsF = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  followedId: string;
};

// type for setProfileInfo function
type PropSPI = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  name: string;
  imgUrl: string;
};

// type for getFollowingList function
type PropsGFIL = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setFollowingList: Dispatch<React.SetStateAction<string[]>>;
};

// type for getFollowedList function
type PropsGFEL = {
  api: ApiPromise | undefined;
  userId: string | undefined;
  setFollowerList: Dispatch<React.SetStateAction<string[]>>;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const imageUrlForUnknown = process.env.NEXT_PUBLIC_UNKNOWN_IMAGE_URL as string;

// check if already create profile in contract function
export const checkCreatedInfo = async (props: PropsCCI) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.checkCreatedInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    const profile = output.toHuman();
    if (typeof profile === "boolean") {
      props.setIsCreatedProfile(profile);
      return;
    }

    props.setIsCreatedProfile(false);
  }
};

// create profile function
export const createProfile = async (props: PropsCP) => {
  console.log(props.actingAccount);
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const create_profile = await contract.tx.createProfile({
    value: 0,
    gasLimit: 18750000000,
  });
  if (injector !== undefined) {
    create_profile.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get profile for home screen function
export const getProfileForHome = async (props: PropsGPFH) => {
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    const imgUrl = output.toHuman();
    if (typeof imgUrl === "string") {
      props.setImgUrl(imgUrl);
      return;
    }

    props.setImgUrl(imageUrlForUnknown);
  }
};

// get profile for profile screen function
export const getProfileForProfile = async (props: PropsGPFP) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    const obj = output.toHuman();
    const { imgUrl, name } = obj as {
      [index: string]: any;
    };

    let imageUrl = imageUrlForUnknown;
    let profileName = "unknown";

    if (typeof imgUrl === "string") {
      imageUrl = imgUrl;
    }

    props.setName("unknown");

    if (typeof name === "string") {
      profileName = name;
    }

    props.setImgUrl(imageUrlForUnknown);
    props.setName(profileName);
  }
};

// get profile for message screen function
export const getProfileForMessage = async (props: PropsGPFM) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    const profile = output.toHuman() as ProfileType | undefined;

    props.setMyImgUrl(
      profile?.imgUrl == null ? imageUrlForUnknown : profile.imgUrl
    );
    props.setImgUrl(
      profile?.imgUrl == null ? imageUrlForUnknown : profile.imgUrl
    );
    props.setFriendList(profile?.friendList == null ? [] : profile.friendList);
    props.setProfile(profile);
  }
};

// get simple profile for message screen function
export const getSimpleProfileForMessage = async (props: PropsGSPFM) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    return output.toHuman();
  }
  return;
};

// follow another account function
export const follow = async (props: PropsF) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount!.meta.source);
  const follow = await contract.tx.follow(
    {
      value: 0,
      gasLimit: 200000000000,
    },
    props.followedId
  );
  if (injector !== undefined) {
    follow.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

export const setProfileInfo = async (props: PropSPI) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress!);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount!.meta.source);
  const set_profile_info = await contract.tx.setProfileInfo(
    {
      value: 0,
      gasLimit: 187500000000,
    },
    props.name,
    props.imgUrl
  );
  if (injector !== undefined) {
    set_profile_info.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get following list function
export const getFollowingList = async (props: PropsGFIL) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getFollowingList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    const list = output.toHuman() as any;
    props.setFollowingList(list);
    console.log(output.toHuman());
  }
  return;
};

// get follower list function
export const getFollowerList = async (props: PropsGFEL) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getFollowerList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.userId
  );
  if (output !== undefined && output !== null) {
    const list = output.toHuman() as any;
    props.setFollowerList(list);
  }
  return;
};
