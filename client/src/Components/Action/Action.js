export function adduser(data) {
  return {
    type: "adduser",
    payload: {
      data: data,
    },
  };
}
export function removeUser() {
  return {
    type: "removeUser",
  };
}

export function changeprofilephoto(data) {
  return {
    type: "changeprofilephoto",
    payload: {
      data: data,
    },
  };
}

export function changeusername(data) {
  return {
    type: "changeusername",
    payload: {
      data: data,
    },
  };
}

export function changeemail(data) {
  return {
    type: "changeemail",
    payload: {
      data: data,
    },
  };
}

export function both({ username, email }) {
  return {
    type: "both",
    payload: {
      username: username,
      email: email,
    },
  };
}
export function changepassword(data) {
  return {
    type: "changepassword",
    payload: {
      data: data,
    },
  };
}

export function changetheme(theme, security) {
  return {
    type: "changetheme",
    payload: {
      theme: theme,
      security: security,
    },
  };
}

export function addpost(data) {
  return {
    type: "addpost",
    payload: {
      data: data,
    },
  };
}

export function follow(data) {
  return {
    type: "follow",
    payload: {
      data: data,
    },
  };
}

export function unfollow(data) {
  return {
    type: "unfollow",
    payload: {
      data: data,
    },
  };
}
