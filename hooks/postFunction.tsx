import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

import abi from "../metadata.json";

// type for post in contract
export type PostType = {
  name: string;
  userId: string;
  createdTime: string;
  imgUrl: string;
  userImgUrl: string;
  description: string;
  numOfLikes: number;
  postId: number;
};

// type for releasePost function
type PropsRP = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  description: string;
  imgUrl: string;
};

// type for getGeneralPost function
type PropsGGP = {
  api: ApiPromise;
  setGeneralPostList: Dispatch<React.SetStateAction<PostType[]>>;
};

// type for addLikes function
type PropsAL = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  postId: number;
};

// type for getIndividualPost function
type PropsGIP = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta | undefined;
  setIndividualPostList: Dispatch<React.SetStateAction<PostType[]>>;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

// release post function
export const releasePost = async (props: PropsRP) => {
  console.log("Call to releasePost: " + `${props.imgUrl}`);
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const release_post = await contract.tx.releasePost(
    {
      value: 0,
      gasLimit: 50000000000,
    },
    props.description,
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-") +
      " " +
      [
        date.getHours().toString().padStart(2, "0"),
        date.getMinutes().toString().padStart(2, "0"),
      ].join(":"),
    props.imgUrl
  );
  if (injector !== undefined) {
    await release_post.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get general post function
export const getGeneralPost = async (props: PropsGGP) => {
  console.log("Call to getGeneralPost");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const { output } = await contract.query.getGeneralPost(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    1
  );

  if (output !== undefined && output !== null) {
    if (output !== undefined && output !== null) {
      const list = output.toHuman();
      props.setGeneralPostList(list as PostType[]);
    }
  }
};

// add like to post function
export const addLikes = async (props: PropsAL) => {
  console.log("Call to addLikes: " + `${props.postId}`);
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount!.meta.source);
  const add_likes = await contract.tx.addLikes(
    {
      value: 0,
      gasLimit: 18850000000,
    },
    props.postId
  );

  if (injector !== undefined) {
    await add_likes.signAndSend(
      performingAccount!.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

// get individual post function
export const getIndividualPost = async (
  props: PropsGIP
): Promise<PostType[]> => {
  console.log("Call to getIndividualPost");
  const contract = new ContractPromise(props.api!, abi, contractAddress!);
  const { gasConsumed, result, output } =
    await contract.query.getIndividualPost(
      "",
      {
        value: 0,
        gasLimit: -1,
      },
      1,
      props.actingAccount?.address
    );
  if (output !== undefined && output !== null) {
    const list = output.toHuman();
    return list as PostType[];
  }

  return [];
};
