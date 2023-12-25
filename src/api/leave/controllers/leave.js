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
    console.log("data", data);
    const response = data.map((d) => {
      return (
        d.user && {
          leaveId: d.id,
          id: d.user.id,
          name: d.user.username,
          leavesGranted: d.leavesGranted,
          leavesRemaining: d.leavesRemaining,
          lossOfPay: d.lossOfPayDays,
          causualLeave: d.CausualLeaves,
          medicalLeave: d.medicalLeave,
          previlageLeave: d.previlageLeave,
          totalLeaves: d.totalLeaves,
        }
      );
    });
    const returnval = response.filter((arr) => arr != null);
    return returnval;
  },
}));
