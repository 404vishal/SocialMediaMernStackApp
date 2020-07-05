export function UserPostReducer(state = "", action) {
  switch (action.type) {
    case "addpost":
      return action.payload.data;
    default:
      return state;
  }
}
