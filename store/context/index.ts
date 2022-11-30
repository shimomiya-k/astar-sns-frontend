import { createContext, Dispatch } from "react";
import { AccountAction, AccountState } from "../../state/account";
import { MyProfileAction, MyProfileState } from "../../state/profile";

type Store = {
  accountState: AccountState;
  accountDispatch: Dispatch<AccountAction>;
  myProfileState: MyProfileState;
  myProfileDispatch: Dispatch<MyProfileAction>;
};

const Context = createContext<Store>({} as Store);

export default Context;
