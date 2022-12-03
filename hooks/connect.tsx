import { ApiPromise, WsProvider } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

// コントラクトとの接続を行うために使用するtype
type Props = {
  api: ApiPromise | undefined;
  accountList: InjectedAccountWithMeta[];
  actingAccount: InjectedAccountWithMeta;
  isSetup: boolean;
  setApi: Dispatch<React.SetStateAction<ApiPromise | undefined>>;
  setAccountList: Dispatch<React.SetStateAction<InjectedAccountWithMeta[]>>;
  setActingAccount: Dispatch<
    React.SetStateAction<InjectedAccountWithMeta | undefined>
  >;
  setIsSetup: React.Dispatch<React.SetStateAction<boolean>>;
};

export const connectedApi = async (): Promise<ApiPromise> => {
  // rpcのURL
  const blockchainUrl = "wss://shibuya.public.blastapi.io";
  const wsProvider = new WsProvider(blockchainUrl);
  return await ApiPromise.create({ provider: wsProvider });
};

// コントラクトとの接続を行うための関数
export const connectToContract = async (): Promise<
  InjectedAccountWithMeta[]
> => {
  const { web3Accounts, web3Enable } = await import("@polkadot/extension-dapp");
  const extensions = await web3Enable("Polk4NET");

  if (extensions.length === 0) {
    return [];
  }

  const accounts = await web3Accounts();

  return accounts;
};
