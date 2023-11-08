"use strict";

/**
 * leave controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::leave.leave", ({ strapi }) => ({
  async getEmployeeLeavelist() {
    const data = await strapi.db.query("api::leave.leave").findMany({
      orderBy: { user: { id: "desc" } },
      populate: ["user"],
    });

    const response = data.map((d) => {
      return (
        d.user && {
          id: d.user.id,
          name: d.user.username,
        }
      );
    });
    const returnval = response.filter((arr) => arr != null);
    return returnval;
  },
}));
