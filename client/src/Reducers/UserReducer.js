export function UserReducer(state = "", action) {
  switch (action.type) {
    case "adduser":
      return action.payload.data;
    case "removeUser":
      return "";
    case "changeprofilephoto":
      let pf = { ...state };
      pf.profilephoto = action.payload.data;
      return pf;
    case "changeusername":
      let os = { ...state };
      os.username = action.payload.data;
      return os;
    case "changeemail":
      let oldstate = { ...state };
      oldstate.email = action.payload.data;
      return oldstate;
    case "both":
      let ff = { ...state };
      ff.username = action.payload.username;
      ff.email = action.payload.email;
      return ff;
    case "changepassword":
      let cp = { ...state };
      cp.password = action.payload.data;
      return cp;
    case "changetheme":
      let ct = { ...state };
      ct.theme = action.payload.theme;
      ct.private = action.payload.security;
      return ct;
    case "addpost":
      let kpop = { ...state, posts: [...state.posts] };
      kpop.posts.push(action.payload.data);
      return kpop;
    case "follow":
      let tr = {
        ...state,
        following: [...state.following, action.payload.data],
      };
      return tr;
    case "unfollow":
      let statep = { ...state, following: [...state.following] };
      let rep = statep.following.filter(
        (ele) => ele._id !== action.payload.data
      );
      statep.following = rep;
      return statep;
    default:
      return state;
  }
}
