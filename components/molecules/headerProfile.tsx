import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Image from "next/image";
import { FC, useContext } from "react";
import Context from "../../store/context";

export type Id = {
  address: string;
};

type Props = {
  imgUrl: string;
  idList: InjectedAccountWithMeta[];
};

const HeaderProfile: FC<Props> = (props) => {
  const { accountState, accountDispatch } = useContext(Context);
  const { currentAccount } = accountState;
  const list = props.idList.map((e) => e.address);

  return (
    <div className="flex-row flex items-center ml-[30px]">
      <Image
        className="w-[70px] h-[70px] rounded-full mr-3"
        src={props.imgUrl}
        alt="profile_logo"
        width={30}
        height={30}
      />
      <div className="mr-3">
        <div>wallet address</div>
        <select
          onChange={(event) => {
            const account: InjectedAccountWithMeta = {
              ...props.idList[Number(event.target.value)],
            };

            accountDispatch({ type: "UPDATE_CURRENT_ACCOUNT", account });
          }}
          className="w-32"
        >
          {props.idList ? (
            props.idList.map((id, index) => (
              <option
                key={index}
                value={index}
                selected={list.indexOf(currentAccount?.address ?? "") == index}
              >
                {" "}
                {id.address}{" "}
              </option>
            ))
          ) : (
            <option className="text-ellipsis overflow-hidden">
              no accounts
            </option>
          )}
        </select>
      </div>
    </div>
  );
};

export default HeaderProfile;
