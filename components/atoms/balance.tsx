import { FC } from "react";

type Props = {
  balance: string;
};

export const Balance: FC<Props> = (props: Props) => {
  return <div className="text-2xl">{props.balance} UNI</div>;
};
