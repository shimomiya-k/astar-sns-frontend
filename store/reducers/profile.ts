import {
  initialMyProfileState,
  MyProfileAction,
  MyProfileState,
} from "../../state/profile";

export const profileReducer = (
  state: MyProfileState,
  action: MyProfileAction
) => {
  let indexOf = -1;
  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        ...action.profile,
        name: action.profile.name ?? initialMyProfileState.name,
        imgUrl: action.profile.imgUrl ?? initialMyProfileState.imgUrl,
      };
    case "UPDATE_FRIEND":
      let { friendList } = state;

      indexOf = friendList.indexOf(action.id);

      if (indexOf > -1) {
        delete friendList[indexOf];
      } else {
        friendList.push(action.id);
      }

      return { ...state, friendList };
    case "UPDATE_FOLLOWING":
      let { followingList } = state;

      indexOf = followingList.indexOf(action.id);

      if (indexOf > -1) {
        delete followingList[indexOf];
      } else {
        followingList.push(action.id);
      }

      return { ...state, followingList };
    case "UPDATE_FOLLOWING":
      let { followerList } = state;

      indexOf = followerList.indexOf(action.id);

      if (indexOf > -1) {
        delete followerList[indexOf];
      } else {
        followerList.push(action.id);
      }

      return { ...state, followerList };
    case "UPDATE_POST_LIST":
      let { postIdList } = state;

      indexOf = postIdList.indexOf(action.id);

      if (indexOf > -1) {
        delete postIdList[indexOf];
      } else {
        postIdList.push(action.id);
      }

      return { ...state, postIdList };
    case "UPDATE_MESSAGE_LIST":
      let { messageListIdList } = state;

      indexOf = messageListIdList.indexOf(action.id);

      if (indexOf > -1) {
        delete messageListIdList[indexOf];
      } else {
        messageListIdList.push(action.id);
      }

      return { ...state, messageListIdList };
    default:
      return state;
  }
};
