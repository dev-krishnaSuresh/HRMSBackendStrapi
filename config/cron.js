module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  rewritingAttendenceStatus: {
    task: async ({ strapi }) => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      const attendanceEntry = await strapi.db
        .query("api::attendence.attendence")
        .findMany({
          orderBy: { id: "desc" },
        });
      console.log("attendanceEntry", attendanceEntry);
      const updatedAttendanceEntry = Promise.all(
        attendanceEntry.map(async (entry) => {
          await strapi.entityService.update(
            "api::attendence.attendence",
            // @ts-ignorewhere
            entry.id,
            {
              data: {
                todayStatus: null,
              },
            }
          );
        })
      );
      console.log("updatedAttendanceEntry", updatedAttendanceEntry);
    },
    options: {
      rule: "* * */1 * *",
    },
  },

  //   "1 1 * * * *": async ({ strapi }) => {
  //     // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
  //     const attendanceEntry = await strapi.db
  //       .query("api::attendence.attendence")
  //       .findMany({
  //         orderBy: { id: "desc" },
  //       });
  //     console.log("attendanceEntry", attendanceEntry);
  //     const updatedAttendanceEntry = await strapi.entityService.update(
  //       "api::attendence.attendence",

  //       // @ts-ignorewhere
  //       attendanceEntry[0].id,
  //       {
  //         data: {
  //           todayStatus: null,
  //         },
  //       }
  //     );
  //     console.log("updatedAttendanceEntry", updatedAttendanceEntry);
  //   },
};
