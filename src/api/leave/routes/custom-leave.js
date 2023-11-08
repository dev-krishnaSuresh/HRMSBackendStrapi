module.exports = {
  routes: [
    {
      method: "GET",
      path: "/getEmployeeLeavelist",
      handler: "leave.getEmployeeLeavelist",
      config: {
        auth: false,
      },
    },
  ],
};
