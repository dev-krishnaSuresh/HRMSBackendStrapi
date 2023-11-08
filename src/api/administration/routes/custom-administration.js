module.exports = {
  routes: [
    {
      method: "GET",
      path: "/getAdministrationlist",
      handler: "administration.getAdministrationlist",
      config: {
        auth: false,
      },
    },
  ],
};
