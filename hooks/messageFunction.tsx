import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { ISubmittableResult } from "@polkadot/types/types";

import abi from "../metadata.json";

// コントラクトの`Message`構造体の型
export type MessageType = {
  message: string;
  senderId: string;
  createdTime: string;
};

// sendMessage関数用の型
type PropsSM = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  message: string;
  id: string;
  callback?: (result: ISubmittableResult) => void;
};

// getMessage関数用の型
type PropsGML = {
  api: ApiPromise | undefined;
  id: number;
};

// lastMessage関数用の型
type PropsGLM = {
  api: ApiPromise | undefined;
  id: number;
};

// コントラクトアドレスをenvファイルから抽出
const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

// メッセージ送信関数
export const sendMessage = async (props: PropsSM) => {
  console.log("Call to sendMessage: " + `${props.id}`);
  if (!props.id) {
    return;
  }

  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const createdAt =
    [date.getMonth() + 1, date.getDate()].join("-") +
    " " +
    [
      date.getHours().toString().padStart(2, "0"),
      date.getMinutes().toString().padStart(2, "0"),
    ].join(":");
  console.log(createdAt);
  const send_message = contract.tx.sendMessage(
    {
      value: 0,
      gasLimit: 18750000000,
    },
    props.message,
    Number(props.id),
    createdAt
  );

  if (injector !== undefined) {
    await send_message.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      props.callback
    );
  }
};

// メッセージリストを取得する関数
export const getMessageList = async (props: PropsGML) => {
  console.log("Call to getMessageList: " + `${props.id}`);
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getMessageList(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.id,
    1
  );

  console.log(output);

  if (output !== undefined && output !== null) {
    return output;
  }
  return [];
};

// それぞれのメッセージリストの最後のメッセージを取得する関数
export const getLastMessage = async (props: PropsGLM) => {
  console.log("Call to getLastMessage: " + `${props.id}`);
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.getLastMessage(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.id
  );

  console.log(output);

  if (output !== undefined && output !== null) {
    const result = output.toHuman() as any;
    return result?.message ?? "";
  }
};
