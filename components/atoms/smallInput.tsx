import { FC } from "react";

type Props = {
  title: string;
  name: string;
};

export const SmallInput: FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-row justify-start my-4">
      <div className="mr-2 text-2xl">{`${props.title}:`}</div>
      <input
        id={props.name}
        name={props.name}
        type="text"
        className="w-24 bg-white"
      />
    </div>
  );
};
