module.exports = {
  routes: [
    {
      method: "GET",
      path: "/getAttendencelist",
      handler: "attendence.getAttendencelist",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/sendOtp",
      handler: "attendence.sendOtp",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/verifyOtp",
      handler: "attendence.verifyOtp",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/signIn",
      handler: "attendence.todaySignIn",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/signOut",
      handler: "attendence.todaySignOut",
      config: {
        auth: false,
      },
    },
  ],
};
