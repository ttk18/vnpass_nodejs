const httpStatus = require('http-status');
const { Sim } = require('../models');
const ApiError = require('../utils/ApiError');
const { SIM_STATUS, SIM_TELECOM_STATUS } = require('../config/rules');
require('../config/logger');
// const logger = require("../config/logger");
/**
 * Create a sim.
 * @param {Object} simBody - Body request
 * @returns {Promise<Sim>}
 */
const createSim = async (simBody) => {
  if (await Sim.isSimCreated(simBody.msisdn)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sim is already created', false);
  }
  return Sim.create({
    msisdn: simBody.msisdn,
    phoneRegex: simBody.msisdn.slice(0, 6),
    cts: simBody.msisdn.slice(5, 12),
  });
};

/**
 * Query all sim distinct fields by domain
 * @param {String} domain - Domain of the the sim
 * @param {String} fieldName - Field name needed to be distinct
 * @returns {Promise<QueryResult>}
 */
const querySimsDistinctByField = async (domain, fieldName) => {
  const result = await Sim.distinct(fieldName, { domain });
  return result;
};

/**
 * Query all sims by limit and page.
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySims = async (filter, options) => {
  const sims = await Sim.paginate(filter, options);
  return sims;
};

/**
 * Get sim by id.
 * @param {ObjectId} id - Sim primary id
 * @returns {Promise<Sim>}
 */
const getSimById = async (id) => {
  return Sim.findById(id);
};

/**
 * Get sim by msisdn.
 * @param {string} msisdn - Sim MSISDN number
 * @returns {Promise<Sim>}
 */
const getSimByMsisdn = async (msisdn) => {
  return Sim.findOne({ msisdn });
};

/**
 * Update sim by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Sim>}
 */
const updateSimById = async (id, updateBody) => {
  const sim = await getSimById(id);
  if (!sim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sim not found');
  }
  Object.assign(sim, updateBody);
  await sim.save();
  return sim;
};

/**
 * Update otp by msisdn
 * @param {String} msisdn
 * @param {Object} updateBody
 * @returns {Promise<Sim>}
 */
const updateSimStatus = async (msisdn, updateBody) => {
  const sim = await getSimByMsisdn(msisdn);
  if (!sim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sim not found');
  }
  const { status, assignedUser } = updateBody;
  if (status !== SIM_STATUS.NEW && status !== SIM_STATUS.ASSIGNED && status !== SIM_STATUS.RECLAIMED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Status updated must be either `new`, `assigned`, `reclaimed`');
  }
  sim.status = updateBody.status;
  sim.assignedUser = assignedUser;
  await sim.save();
  return sim;
};

/**
 * Update otp by msisdn
 * @param {String} msisdn
 * @param {Object} updateBody
 * @returns {Promise<Sim>}
 */
const updateSimTelecomStatus = async (msisdn, updateBody) => {
  const sim = await getSimByMsisdn(msisdn);
  if (!sim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sim not found');
  }
  const { telecomStatus } = updateBody;
  if (
    telecomStatus !== SIM_TELECOM_STATUS.AVAILABLE &&
    telecomStatus !== SIM_TELECOM_STATUS.UNAVAILABLE &&
    telecomStatus !== SIM_TELECOM_STATUS.DISCONNECTED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Telecom Status updated must be either `available`, `unavailable`, `disconnected`'
    );
  }
  sim.status = telecomStatus;
  await sim.save();
  return sim;
};

/**
 * Delete sim by Id
 * @param {ObjectId} simId - Sim Id
 * @returns {Promise<Sim>}
 */
const deleteSimById = async (id) => {
  const sim = await getSimById(id);
  if (!sim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sim not found');
  }
  await sim.remove();
  return sim;
};

module.exports = {
  createSim,
  querySims,
  querySimsDistinctByField,
  getSimById,
  getSimByMsisdn,
  updateSimById,
  updateSimStatus,
  updateSimTelecomStatus,
  deleteSimById,
};
