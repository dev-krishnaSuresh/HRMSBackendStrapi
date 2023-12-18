"use strict";

/**
 * attendence controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Adjust the path based on your setup

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
    async sendOtp(ctx) {
      const { phoneNumber } = ctx.request.body;

      // Validate input
      if (!phoneNumber) {
        return ctx.badRequest("Please provide phone number.");
      }

      // Search for the user in the database
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { phone: phoneNumber },
        });

      // Check if the user exists
      if (!user) {
        return ctx.badRequest("Invalid phone number or password.");
      }

      // Generate a 6-digit random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Save the OTP to the user's record
      await strapi.entityService.update(
        "plugin::users-permissions.user",
        user.id,
        { data: { otp: otp } }
      );

      // Send the OTP to the user (Implement your own logic here)

      return ctx.send({ message: "OTP sent successfully." });
    },

    async verifyOtp(ctx) {
      const { phoneNumber, otp } = ctx.request.body;

      // Validate input
      if (!phoneNumber || !otp) {
        return ctx.badRequest("Please provide both phone number and OTP.");
      }

      // Search for the user in the database
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { phone: phoneNumber },
        });

      // Check if the user exists
      if (!user) {
        return ctx.badRequest("Invalid phone number.");
      }

      // Compare the provided OTP with the one stored in the user's record
      if (user.otp !== otp) {
        return ctx.badRequest("Wrong OTP.");
      }

      // Clear the OTP field after successful verification
      await strapi.entityService.update(
        "plugin::users-permissions.user",
        user.id,
        { data: { otp: null } }
      );

      // Generate JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Adjust the expiration time as needed
      });
      // const token = createJwt({ id: user.id });

      // Return JWT token and user details
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          ...user,
          // Add other user details as needed
        },
        message: "OTP verification successful.",
      };
    },
    todaySignIn: async (ctx) => {
      try {
        const { user_id } = ctx.request.body;
        const todayDate = new Date().toLocaleDateString("en-US"); // Get today's date in the format MM-DD-YYYY

        // Find the attendance entry for the user with the given user ID
        const attendanceEntryData = await strapi.db
          .query("api::attendence.attendence")
          .findMany({
            orderBy: { user: { id: "desc" } },
            populate: ["user"],
          });
        const attendanceEntry = attendanceEntryData.filter((d) => {
          if (d.user.id == user_id) {
            return d;
          }
        });
        if (attendanceEntry.length == 0) {
          return ctx.throw(404, "Attendance entry not found for the user.");
        }

        // Parse the existing attendanceData JSON or initialize it if it doesn't exist
        // @ts-ignore
        const attendanceData = attendanceEntry[0].attendanceData
          ? // @ts-ignore
            JSON.parse(attendanceEntry[0].attendanceData)
          : {};

        // Check if today's date already exists in the attendanceData
        if (!attendanceData[todayDate]) {
          // If not, create a new entry for today's date with loggedIn and loggedOut keys
          attendanceData[todayDate] = {
            loggedIn: "",
            loggedOut: "",
          };
        }

        // Update the loggedIn and loggedOut values for today's date
        attendanceData[todayDate].loggedIn = ctx.request.body.loggedIn || "";
        // attendanceData[todayDate].loggedOut = ctx.request.body.loggedOut || "";
        // Update the attendance entry with the modified attendanceData
        // @ts-ignorewhere
        const updatedAttendanceEntry = await strapi.entityService.update(
          "api::attendence.attendence",

          // @ts-ignorewhere
          attendanceEntry[0].id,
          {
            data: {
              attendenceData: attendanceData,
              todayStatus: "Present",
            },
          }
        );

        // Return the updated attendance entry
        ctx.send(updatedAttendanceEntry);
      } catch (error) {
        ctx.throw(500, "Internal Server Error", error);
      }
    },
    todaySignOut: async (ctx) => {
      try {
        const { user_id } = ctx.request.body;
        const todayDate = new Date().toLocaleDateString("en-US"); // Get today's date in the format MM-DD-YYYY

        // Find the attendance entry for the user with the given user ID
        const attendanceEntryData = await strapi.db
          .query("api::attendence.attendence")
          .findMany({
            orderBy: { user: { id: "desc" } },
            populate: ["user"],
          });
        const attendanceEntry = attendanceEntryData.filter((d) => {
          if (d.user.id == user_id) {
            return d;
          }
        });
        if (attendanceEntry.length == 0) {
          return ctx.throw(404, "Attendance entry not found for the user.");
        }

        // Parse the existing attendanceData JSON or initialize it if it doesn't exist
        let attendenceData = attendanceEntry[0].attendanceData
          ? JSON.parse(attendanceEntry[0].attendenceData)
          : {};
        console.log(attendanceEntry, attendenceData);
        // Check if today's date already exists in the attendanceData
        // if (attendenceData[todayDate]) {
        //   // If not, create a new entry for today's date with loggedIn and loggedOut keys
        //   attendenceData[todayDate] = {
        //     loggedIn: "",
        //     loggedOut: "",
        //   };
        // } else {
        //   attendenceData[todayDate] = {
        //     loggedIn: attendenceData[todayDate].loggedIn,
        //     loggedOut: "",
        //   };
        // }

        // Update the loggedIn and loggedOut values for today's date
        attendenceData[todayDate].loggedIn =
          attendenceData[todayDate].loggedIn || "";
        attendenceData[todayDate].loggedOut = ctx.request.body.loggedOut || "";
        console.log("attendanceData", attendenceData);
        // attendenceData = {...attendenceData }
        // Update the attendance entry with the modified attendanceData
        const updatedAttendanceEntry = await strapi.entityService.update(
          "api::attendence.attendence",
          attendanceEntry[0].id,
          {
            data: {
              attendanceData: attendenceData,
              todayStatus: "LoggedOut",
            },
          }
        );

        // Return the updated attendance entry
        ctx.send(updatedAttendanceEntry);
      } catch (error) {
        ctx.throw(500, "Internal Server Error");
      }
    },
  })
);
