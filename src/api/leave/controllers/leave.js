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
  async leaveAppyEmp(ctx) {
    const { userId, payload } = ctx.request.body;
    const data = await strapi.db.query("api::leave.leave").findMany({
      orderBy: { user: { id: "desc" } },
      populate: ["user"],
    });
    const userData = data.filter((d) => d.user && d.user.id == userId);

    await strapi.entityService.update(
      "api::leave.leave",
      // @ts-ignorewhere
      userData[0].id,
      {
        data: {
          leaveRequests: userData[0].leaveRequests
            ? [...userData[0].leaveRequests, payload[0]]
            : payload,
        },
      }
    );
    return "Leave has been applied successfully";
  },
  async leaveListEmp(ctx) {
    const { leaveType, leaveStatus, userId } = ctx.request.body;
    const data = await strapi.db.query("api::leave.leave").findMany({
      orderBy: { user: { id: "desc" } },
      populate: ["user"],
    });
    const userData = data.filter((d) => d.user && d.user.id == userId);
    const leaveData = userData[0].leaveRequests?.filter(
      (d) => d.approval == leaveStatus
    );
    console.log(leaveData);

    return leaveData;
  },
  async leaveApprovalListEmp(ctx) {
    const { leaveStatus } = ctx.request.body;
    let leaveData = [];
    const data = await strapi.db.query("api::leave.leave").findMany({
      orderBy: { user: { id: "desc" } },
      populate: ["user"],
    });
    data.map((d) => {
      d?.leaveRequests?.filter((leaveRequest) => {
        console.log(leaveRequest);
        if (
          leaveRequest &&
          leaveRequest?.approval &&
          leaveRequest?.approval != "undefined" &&
          leaveRequest?.approval == leaveStatus
        ) {
          leaveData.push({
            userId: d.user.id,
            name: d.user.username,
            approvalStatus: leaveRequest?.approval,
            leaveType: leaveRequest.leaveType,
            numberOfDays: leaveRequest.noOfDays,
            reasonForLeave: leaveRequest.reason,
            toDate: leaveRequest.toDate,
            fromDate: leaveRequest.fromDate,
            toSession: leaveRequest.toSession,
            fromSession: leaveRequest.fromSession,
          });
        }
      });
    });
    console.log(leaveData);

    return leaveData;
  },
}));
