const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const logger = require('../config/logger');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  logger.info(
    `Created user id=${user.id} name=${user.name} email=${user.email} role=${user.role} brandRegex=${user.brandRegex}`
  );
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role', 'phoneRegex', 'brandRegex']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  logger.info(
    `Query users name=${req.query.name} role=${req.query.role} brandRegex=${req.query.brandRegex} sortBy=${req.query.sortBy} limit=${req.query.limit} page=${req.query.page}`
  );
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    logger.error('User not found');
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  logger.info(
    `Get user id=${user.id} name=${user.name} email=${user.email} role=${user.role} brandRegex=${user.brandRegex}`
  );
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  logger.info(
    `Updated user id=${user.id} name=${user.name} email=${user.email} role=${user.role} brandRegex=${user.brandRegex}`
  );
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  logger.info(`Deleted user id=${req.params.userId}`);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
