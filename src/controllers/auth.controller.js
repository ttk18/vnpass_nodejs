const httpStatus = require('http-status');
const admin = require('firebase-admin');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, simService } = require('../services');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { objectIsNullOrEmpty } = require('../utils/common');
const { SIM_STATUS } = require('../config/rules');
const pick = require('../utils/pick');

const register = catchAsync(async (req, res) => {
  try {
    // Step 1: Create new firebase user with the phone number
    const firebaseUser = await admin.auth().createUser({
      displayName: req.body.displayName,
      phoneNumber: req.body.phoneNumber,
      disabled: false,
    });
    logger.info(
      `Successfully created new Firebase user=${firebaseUser.uid} name=${req.body.displayName} phone=${req.body.phoneNumber}`
    );

    // Step 2: Create new gtalk user with the provided info
    let user = userService.getUserByMsisdn(req.body.msisdn);
    if (!objectIsNullOrEmpty(user)) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `User with msisdn=${req.body.msisdn} has been registered`);
    }
    user = await userService.createUser({
      domain: req.body.domain,
      displayName: req.body.displayName,
      phoneNumber: req.body.phoneNumber,
      eid: req.body.eid,
      eidIssuedDate: req.body.eidIssuedDate,
      eidIssuedBy: req.body.eidIssuedBy,
      dateOfBirth: req.body.dateOfBirth,
      placeOfOrigin: req.body.placeOfOrigin,
      gender: req.body.gender,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
      msisdn: req.body.msisdn,
      firebaseUid: firebaseUser.uid,
      fcmToken: req.body.fcmToken,
      deviceUid: req.body.deviceUid,
      deviceName: req.body.deviceName,
      devicePlatform: req.body.devicePlatform,
      isKyc: req.body.isKyc,
      isVerified: false,
      isLoggedIn: true,
    });

    // Step 3: Generate token
    const tokens = await tokenService.generateAuthTokens(user);
    logger.info(
      `Successfully created new user name=${user.name} msisdn=${req.body.msisdn} phone=${req.body.phoneNumber} firebaseUid=${firebaseUser.uid}`
    );

    // Step 4: Mark the msisdn has been used
    const sim = await simService.updateSimStatus(req.body.msisdn, {
      assignedUser: user.id,
      status: SIM_STATUS.ASSIGNED,
    });
    logger.info(`Successfully assigned msisdn=${sim.msisdn} user=${sim.assignedUser}`);

    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    logger.error(`${error}`);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
});

const getPhoneNumber = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['msisdn']);
  const user = await userService.getUserByMsisdn(filter.msisdn);
  const phoneNumber = objectIsNullOrEmpty(user) ? null : user.phoneNumber;
  logger.info(`Find phone number for msisdn=${filter.msisdn} found number=${phoneNumber}`);
  res.send({ phoneNumber });
});

const login = catchAsync(async (req, res) => {
  const { phoneNumber, msisdn, firebaseUid, fcmToken } = req.body;
  let user = await authService.loginUserWithPhoneNumber(phoneNumber, msisdn, firebaseUid);
  const tokens = await tokenService.generateAuthTokens(user);
  user = await userService.updateUserById(user.id, { fcmToken });
  logger.info(`Logged in user phone=${phoneNumber} msisdn=${msisdn} firebaseUid=${firebaseUid}`);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const { userId, refreshToken } = req.body;
  await authService.logout(refreshToken);
  await userService.updateUserById(userId, { isLoggedIn: false });
  logger.info(`Logged out user token=${refreshToken}`);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  logger.info(`Refreshed token=${req.body.refreshToken}`);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  logger.info(`Sent forgot password email=${req.body.email} toke=${resetPasswordToken}`);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  logger.info(`Reset password token=${req.query.token}`);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  logger.info(`Sent verification email=${req.user.email}`);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  logger.info(`Verified token=${req.query.token}`);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  getPhoneNumber,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
