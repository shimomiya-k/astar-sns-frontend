import { ApiPromise } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch } from "react";

import abi from "../metadata.json";

type PropsBO = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  setBalance: Dispatch<React.SetStateAction<string>>;
};

type PropsTF = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
  amount: number;
};

type PropsDRL = {
  api: ApiPromise | undefined;
  actingAccount: InjectedAccountWithMeta;
};

const contractAddress: string = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as string;

export const balenceOf = async (props: PropsBO) => {
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const { gasConsumed, result, output } = await contract.query.balanceOf(
    "",
    {
      value: 0,
      gasLimit: -1,
    },
    props.actingAccount.address
  );
  if (output !== undefined && output !== null) {
    const balance = output.toHuman();
    props.setBalance(balance!.toString());
  }
};

export const transfer = async (props: PropsTF) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const transfer = await contract.tx.transfer(
    {
      value: 0,
      gasLimit: 31518000000,
    },
    props.amount
  );
  if (injector !== undefined) {
    transfer.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};

export const distributeReferLikes = async (props: PropsDRL) => {
  const { web3FromSource } = await import("@polkadot/extension-dapp");
  const contract = new ContractPromise(props.api!, abi, contractAddress);
  const performingAccount = props.actingAccount;
  const injector = await web3FromSource(performingAccount.meta.source);
  const date = new Date();
  const transfer = await contract.tx.distributeReferLikes({
    value: 0,
    gasLimit: 31518000000,
  });
  if (injector !== undefined) {
    transfer.signAndSend(
      performingAccount.address,
      { signer: injector.signer },
      (result) => {}
    );
  }
};
