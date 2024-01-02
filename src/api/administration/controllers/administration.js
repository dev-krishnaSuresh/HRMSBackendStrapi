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
            administrationId: d.id,
            id: d.user.id,
            name: d.user.username,
            designation: d.currentDesignation,
            department: d.currentDepartment,
            promotionApproval: d.promotionApproval,
          }
        );
      });
      const returnval = response.filter((arr) => arr != null);
      return returnval;
    },
    async getPromotionApprovelist() {
      let filteredData = [];
      const data = await strapi.db
        .query("api::administration.administration")
        .findMany({
          orderBy: { user: { id: "desc" } },
          populate: ["user"],
        });

      Promise.all(
        data.map((d) => {
          d.user &&
            d.promotionApproval &&
            d.promotionApproval.map((p) => {
              console.log(p, d);
              if (p.approval == "Waiting for Approval") {
                filteredData.push({
                  administrationId: d.id,
                  id: d.user.id,
                  name: d.user.username,
                  designation: d.currentDesignation,
                  department: d.currentDepartment,
                  promotionApproval: p,
                });
              }
            });
        })
      );

      const returnval = filteredData.filter((arr) => arr != null);
      return { returnval, count: returnval.length };
    },
  })
);
