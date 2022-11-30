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
  const blockchainUrl = "ws://127.0.0.1:9944";
  const wsProvider = new WsProvider(blockchainUrl);
  return await ApiPromise.create({ provider: wsProvider });
};

// コントラクトとの接続を行うための関数
export const connectToContract = async (): Promise<
  InjectedAccountWithMeta[]
> => {
  // rpcのURL
  // const blockchainUrl = "ws://127.0.0.1:9944";

  // この関数でアカウント情報を取得する
  const extensionSetup = async (): Promise<InjectedAccountWithMeta[]> => {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("Polk4NET");

    if (extensions.length === 0) {
      return [];
    }

    const accounts = await web3Accounts();

    return accounts;
  };

  // この部分でコントラクトに接続
  // const wsProvider = new WsProvider(blockchainUrl);
  // const connectedApi = await ApiPromise.create({ provider: wsProvider });
  // props.setApi(connectedApi);
  return extensionSetup();
};
