import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ISubmittableResult } from "@polkadot/types/types";
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

// type for createProoject function
type PropsCP = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  callback?: (result: ISubmittableResult) => void;
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

// type for createCheckInfo function
type PropsCCI = {
  api: ApiPromise | undefined;
  userId: string | undefined;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

// create profile function
export const createProfile = async (props: PropsCP) => {
  console.log("Call to createProfile");
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  console.log(performingAccount);
  const injector = await web3FromSource(performingAccount.meta.source);
  const create_profile = contract.tx.createProfile({
    value: 0,
    gasLimit: 18750000000,
  });

  if (injector !== undefined) {
    await create_profile.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      props.callback
    );
  }
};

export const checkCreatedInfo = async (props: PropsCCI): Promise<boolean> => {
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
    return output.toHuman() as boolean;
  }

  return false;
};

export const getProfile = async (
  api: ApiPromise,
  userId: string
): Promise<ProfileType | undefined> => {
  console.log("Call to getProfile");
  const contract = new ContractPromise(api, abi, contractAddress);
  const { output } = await contract.query.getProfileInfo(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    `${userId}`
  );

  if (output !== undefined && output !== null) {
    return output.toHuman() as ProfileType | undefined;
  }

  return;
};

// follow another account function
export const follow = async (props: PropsF) => {
  console.log("Call to follow: " + `${props.followedId}`);
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
    await follow.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

export const setProfileInfo = async (props: PropSPI) => {
  console.log("Call to setProfileInfo: " + `${props.name}`);
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
    await set_profile_info.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get following list function
export const getFollowingList = async (props: PropsGFIL): Promise<string[]> => {
  console.log("Call to getFollowingList: " + `${props.userId}`);
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
    return list;
  }

  return [];
};

// get follower list function
export const getFollowerList = async (props: PropsGFEL): Promise<string[]> => {
  console.log("Call to getFollowerList: " + `${props.userId}`);
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
    return list;
  }
  return [];
};
