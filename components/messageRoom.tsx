import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import React, { Dispatch, useContext } from "react";

import { FormBox } from "../components/molecules/formBox";
import { MessageBar } from "../components/organisms/messageBar";
import { sendMessage } from "../hooks/messageFunction";
import type { MessageType } from "../hooks/messageFunction";
import Message from "./message";
import Context from "../store/context";
import { MyProfileState } from "../state/profile";

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
  refreshMessageMemberList: (props: MyProfileState) => Promise<void>;
};

export default function MessageRoom(props: Props) {
  const { myProfileState } = useContext(Context);

  const submit = async (event: any) => {
    event.preventDefault();
    await sendMessage({
      api: props.api,
      actingAccount: props.actingAccount,
      message: event.target.message.value,
      id: props.messageListId,
      callback: (result) => {
        if (result.isCompleted) {
          props.refreshMessageMemberList(myProfileState);
        }
      },
    });
    event.target.message.value = "";
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen ">
      <main className="h-screen w-screen max-w-4xl flex flex-col">
        <MessageBar
          userImgUrl={props.userImgUrl}
          userName={props.userName}
          setShowMessageModal={props.setShowMessageModal}
        />
        <div className="flex-1 overflow-scroll h-full w-full">
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
