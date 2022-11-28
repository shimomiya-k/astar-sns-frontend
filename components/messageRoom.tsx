import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Image from "next/image";
import React, { Dispatch } from "react";
import { BsArrowLeft } from "react-icons/bs";

import { InputBox } from "../components/atoms/inputBox";
import { SendButton } from "../components/atoms/sendButton";
import { FormBox } from "../components/molecules/formBox";
import { MessageBar } from "../components/organisms/messageBar";
import { sendMessage } from "../hooks/messageFunction";
import type { MessageType } from "../hooks/messageFunction";
import Message from "./message";

type Props = {
  api: ApiPromise;
  actingAccount: InjectedAccountWithMeta;
  messageListId: string;
  userImgUrl: string;
  userName: string;
  messageList: Array<MessageType>;
  setShowMessageModal: Dispatch<React.SetStateAction<boolean>>;
  myUserId: string;
  myImgUrl: string;
};

export default function MessageRoom(props: Props) {
  const submit = async (event: any) => {
    event.preventDefault();
    await sendMessage({
      api: props.api,
      actingAccount: props.actingAccount,
      message: event.target.message.value,
      id: props.messageListId,
    });
    event.target.message.value = "";
  };

  return (
    <div className="flex justify-center items-cente w-screen h-screen ">
      <main className="items-center h-screen max-w-4xl fle flex-col">
        <MessageBar
          userImgUrl={props.userImgUrl}
          userName={props.userName}
          setShowMessageModal={props.setShowMessageModal}
        />
        <div className="flex-1 overflow-scroll w-full">
          {props.messageList.map((message) => (
            <div key={message.message}>
              <Message
                account_id={props.myUserId}
                img_url={
                  props.myUserId == message.senderId
                    ? props.myImgUrl
                    : props.userImgUrl
                }
                time={message.createdTime}
                message={message.message}
                senderId={message.senderId}
              />
            </div>
          ))}
        </div>
        <FormBox submit={submit} />
      </main>
    </div>
  );
}
