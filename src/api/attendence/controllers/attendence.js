"use strict";

/**
 * attendence controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::attendence.attendence",
  ({ strapi }) => ({
    async getAttendencelist() {
      const data = strapi.db.query("api::attendence.attendence").findMany({
        offset: 5,
        limit: 10,
      });
    },
  })
);
