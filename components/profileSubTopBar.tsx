import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { Dispatch } from "react";

import { BiggerProfileIcon } from "./atoms/biggerProfileIcon";
import { ProfileList } from "./molecules/profileList";

type Props = {
  imgUrl: string;
  name: string;
  isOpenModal: Dispatch<React.SetStateAction<boolean>>;
  idList: InjectedAccountWithMeta[];
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  followingList: Array<string>;
  followerList: Array<string>;
};

export default function ProfileSubTopBar(props: Props) {
  return (
    <div className="flex flex-row mt-2 border-b-2 w-full items-center justify-center">
      <BiggerProfileIcon imgUrl={props.imgUrl} />
      <ProfileList
        name={props.name}
        isOpenModal={props.isOpenModal}
        idList={props.idList}
        api={props.api}
        actingAccount={props.actingAccount}
        followingList={props.followingList}
        followerList={props.followerList}
      />
    </div>
  );
}
