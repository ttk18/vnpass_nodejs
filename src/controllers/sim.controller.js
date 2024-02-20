const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { simService } = require('../services');
const { objectIsNullOrEmpty } = require('../utils/common');
const logger = require('../config/logger');

const createSim = catchAsync(async (req, res) => {
  logger.info(`Create sim msisdn=${req.body.msisdn}`);
  const result = await simService.createSim(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getSimPrefixes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['domain']);
  logger.info(`Get sim prefixes for domain=${filter.domain}`);
  const result = await simService.querySimsDistinctByField(filter.domain, 'prefix');
  res.send({ result });
});

const getSims = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['msisdn', 'prefix', 'phoneRegex', 'cts', 'domain', 'status', 'telecomStatus']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  logger.info(
    `Get sims domain=${filter.domain} msisdn=${filter.msisdn} phoneRegex=${filter.phoneRegex} cts=${filter.cts} page=${options.page} limit=${options.limit}`
  );
  if (!objectIsNullOrEmpty(filter.msisdn)) {
    if (req.query.position === 'endsWith') {
      filter.msisdn = { $regex: `${filter.msisdn}$` };
    } else {
      filter.msisdn = { $regex: filter.msisdn };
    }
  }
  const result = await simService.querySims(filter, options);
  res.send(result);
});

const searchSims = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['domain', 'msisdn']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  logger.info(
    `Search sims domain=${filter.domain} msisdn=${filter.msisdn} position=${filter.position} sortBy=${options.sortBy} page=${options.page} limit=${options.limit}`
  );
  if (!objectIsNullOrEmpty(filter.msisdn)) {
    if (req.query.position === 'start') {
      filter.msisdn = { $regex: `^${filter.msisdn}` };
    } else if (req.query.position === 'end') {
      filter.msisdn = { $regex: `${filter.msisdn}$` };
    } else {
      filter.msisdn = { $regex: filter.msisdn };
    }
  }
  const result = await simService.querySims(filter, options);
  res.send(result);
});

const getSim = catchAsync(async (req, res) => {
  const { brandType } = req.query;
  logger.info(`Get sim by id=${req.params.simId} brandType=${brandType}`);
  const result = await simService.getSimById(req.params.simId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sim not found');
  }
  res.send(result);
});

const updateSim = catchAsync(async (req, res) => {
  logger.info(`Update sim by id=${req.params.simId}`);
  const result = await simService.updateSimById(req.params.simId, req.body);
  res.send(result);
});

const deleteSim = catchAsync(async (req, res) => {
  logger.info(`Delete sim id=${req.params.simId}`);
  await simService.deleteSimById(req.params.simId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSim,
  getSimPrefixes,
  getSims,
  searchSims,
  getSim,
  updateSim,
  deleteSim,
};
