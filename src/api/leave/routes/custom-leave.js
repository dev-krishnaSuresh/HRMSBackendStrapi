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
    {
      method: "POST",
      path: "/leaveAppyEmp",
      handler: "leave.leaveAppyEmp",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/leaveListEmp",
      handler: "leave.leaveListEmp",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/leaveApprovalListEmp",
      handler: "leave.leaveApprovalListEmp",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/leaveApproval",
      handler: "leave.leaveApproval",
      config: {
        auth: false,
      },
    },
  ],
};
