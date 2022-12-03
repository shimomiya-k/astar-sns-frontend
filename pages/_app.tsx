import "../styles/globals.css";
import type { AppProps } from "next/app";
import Context from "../store/context";
import { useEffect, useReducer } from "react";
import { initialAccountState } from "../state/account";
import { accountReducer } from "../store/reducers/account";
import { profileReducer } from "../store/reducers/profile";
import { initialMyProfileState } from "../state/profile";

export default function App({ Component, pageProps }: AppProps) {
  const [accountState, accountDispatch] = useReducer(
    accountReducer,
    initialAccountState
  );

  const [myProfileState, myProfileDispatch] = useReducer(
    profileReducer,
    initialMyProfileState
  );

  return (
    <Context.Provider
      value={{
        accountState,
        accountDispatch,
        myProfileState,
        myProfileDispatch,
      }}
    >
      <Component {...pageProps} />
    </Context.Provider>
  );
}
