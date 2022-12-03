import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export const initialAccountState: AccountState = { accounts: [] };

export type AccountState = {
  api?: ApiPromise;
  accounts: InjectedAccountWithMeta[];
  currentAccount?: InjectedAccountWithMeta;
};

export type AccountAction =
  | { type: "UPDATE_ACCOUNT_STATE"; state: AccountState }
  | { type: "UPDATE_API"; api: ApiPromise }
  | { type: "UPDATE_ACCOUNTS"; accounts: InjectedAccountWithMeta[] }
  | { type: "UPDATE_CURRENT_ACCOUNT"; account: InjectedAccountWithMeta };
