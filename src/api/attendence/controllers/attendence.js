"use strict";

/**
 * attendence controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::attendence.attendence",
  ({ strapi }) => ({
    async getAttendencelist() {
      const data = await strapi.db
        .query("api::attendence.attendence")
        .findMany({
          orderBy: { user: { id: "desc" } },
          populate: ["user"],
        });
      const response = data.map((d) => {
        return (
          d.user && {
            id: d.user.id,
            name: d.user.username,
            daysPresent: d.daysPresentInCurrentMonth,
            daysAbsent: d.daysAbsentInCurrentMonth,
            attendanceStatus: d.todayStatus,
          }
        );
      });
      const returnval = response.filter((arr) => arr != null);
      return returnval;
    },
  })
);
