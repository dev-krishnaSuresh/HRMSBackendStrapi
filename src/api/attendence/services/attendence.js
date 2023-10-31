'use strict';

/**
 * attendence service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::attendence.attendence');
