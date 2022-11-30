import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Dispatch, FC, useContext } from "react";
import { BsGear } from "react-icons/bs";
import Context from "../../store/context";

type Props = {
  isOpenModal: Dispatch<React.SetStateAction<boolean>>;
  name: string;
  idList: InjectedAccountWithMeta[];
  setIsCreatedFnRun: Dispatch<React.SetStateAction<boolean>>;
};

export const WalletAddressSelection: FC<Props> = (props: Props) => {
  const { accountDispatch } = useContext(Context);
  return (
    <>
      <div>Wallet Address</div>
      <div className="text-ellipsis overflow-hidden w-44 items-center flex justify-center">
        <select
          onChange={(event) => {
            const account: InjectedAccountWithMeta = {
              ...props.idList[Number(event.target.value)],
            };

            accountDispatch({ type: "UPDATE_CURRENT_ACCOUNT", account });
          }}
          className="w-32 items-center flex"
        >
          {props.idList !== undefined ? (
            props.idList.map((id, index) => (
              <option key={index} value={index}>
                {id.address}
              </option>
            ))
          ) : (
            <option className="text-ellipsis overflow-hidden">
              no accounts
            </option>
          )}
        </select>
      </div>
    </>
  );
};
