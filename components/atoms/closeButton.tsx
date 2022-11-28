import { Dispatch, FC } from "react";

type Props = {
  afterOpenFn: Dispatch<React.SetStateAction<boolean>>;
};

export const CloseButton: FC<Props> = (props: Props) => {
  return (
    <button
      className="rounded-3xl h-10 w-32 bg-[#003AD0] text-white"
      onClick={() => props.afterOpenFn(false)}
    >
      Close
    </button>
  );
};
