export const initialMyProfileState: MyProfileState = {
  name: "unknown",
  imgUrl: process.env.NEXT_PUBLIC_UNKNOWN_IMAGE_URL!,
  friendList: [],
  followingList: [],
  followerList: [],
  postIdList: [],
  messageListIdList: [],
};

export type MyProfileState = {
  userId?: string;
  name: string;
  imgUrl: string;
  friendList: Array<string>;
  followingList: Array<string>;
  followerList: Array<string>;
  postIdList: Array<number>;
  messageListIdList: Array<number>;
};

export type MyProfileAction =
  | { type: "UPDATE_PROFILE"; profile: MyProfileState }
  | { type: "UPDATE_FRIEND"; id: string }
  | { type: "UPDATE_FOLLOWING"; id: string }
  | { type: "UPDATE_FOLLOWER"; id: string }
  | { type: "UPDATE_POST_LIST"; id: number }
  | { type: "UPDATE_MESSAGE_LIST"; id: number };
