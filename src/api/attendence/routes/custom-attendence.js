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
  ],
};
