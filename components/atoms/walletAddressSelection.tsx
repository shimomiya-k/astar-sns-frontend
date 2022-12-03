import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch, FC, useContext } from "react";
import { BsGear } from "react-icons/bs";
import Context from "../../store/context";

type Props = {
  isOpenModal: Dispatch<React.SetStateAction<boolean>>;
  name: string;
  idList: InjectedAccountWithMeta[];
};

export const WalletAddressSelection: FC<Props> = (props: Props) => {
  const { accountState, accountDispatch } = useContext(Context);
  const { currentAccount } = accountState;
  const list = props.idList.map((e) => e.address);
  return (
    <>
      <div>Wallet Address</div>
      <div className="text-ellipsis overflow-hidden w-44 items-center flex justify-center">
        {props.idList !== undefined ? (
          <select
            onChange={(event) => {
              const account: InjectedAccountWithMeta = {
                ...props.idList[Number(event.target.value)],
              };

              accountDispatch({ type: "UPDATE_CURRENT_ACCOUNT", account });
            }}
            className="w-32 items-center flex"
          >
            {props.idList.map((id, index) => (
              <option
                key={index}
                value={index}
                selected={list.indexOf(currentAccount?.address ?? "") == index}
              >
                {id.address}
              </option>
            ))}
          </select>
        ) : (
          <option className="text-ellipsis overflow-hidden">no accounts</option>
        )}
      </div>
    </>
  );
};
