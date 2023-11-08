'use strict';

/**
 * exit-management service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::exit-management.exit-management');
