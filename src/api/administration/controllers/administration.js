"use strict";

/**
 * administration controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::administration.administration",
  ({ strapi }) => ({
    async getAdministrationlist() {
      const data = await strapi.db
        .query("api::administration.administration")
        .findMany({
          orderBy: { user: { id: "desc" } },
          populate: ["user"],
        });
      const response = data.map((d) => {
        return (
          d.user && {
            id: d.user.id,
            name: d.user.username,
            designation: d.currentDesignation,
            department: d.currentDepartment,
          }
        );
      });
      const returnval = response.filter((arr) => arr != null);
      return returnval;
    },
  })
);
