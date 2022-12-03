import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { Dispatch, FC } from "react";

import { ProfileTitle } from "../atoms/profileTitle";
import { WalletAddressSelection } from "../atoms/walletAddressSelection";

type Props = {
  name: string;
  isOpenModal: Dispatch<React.SetStateAction<boolean>>;
  idList: InjectedAccountWithMeta[];
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  followingList: Array<string>;
  followerList: Array<string>;
};

export const ProfileList: FC<Props> = (props: Props) => {
  return (
    <div className="flex items-center flex-col">
      <ProfileTitle name={props.name} isOpenModal={props.isOpenModal} />
      <WalletAddressSelection
        isOpenModal={props.isOpenModal}
        name={props.name}
        idList={props.idList}
      />
      <div className="">{`${props.followingList.length} following ${props.followerList.length} follower `}</div>
    </div>
  );
};
