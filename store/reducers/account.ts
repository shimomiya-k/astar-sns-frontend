import { AccountAction, AccountState } from "../../state/account";

export const accountReducer = (state: AccountState, action: AccountAction) => {
  switch (action.type) {
    case "UPDATE_API":
      return {
        ...state,
        api: action.api,
      };
    case "UPDATE_ACCOUNTS":
      return {
        ...state,
        accounts: action.accounts,
        currentAccount:
          action.accounts.length > 0 ? action.accounts[0] : undefined,
      };
    case "UPDATE_CURRENT_ACCOUNT":
      return {
        ...state,
        currentAccount: action.account,
      };
    default:
      return state;
  }
};
