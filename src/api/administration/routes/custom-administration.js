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
    {
      method: "GET",
      path: "/getPromotionApprovelist",
      handler: "administration.getPromotionApprovelist",
      config: {
        auth: false,
      },
    },
  ],
};
