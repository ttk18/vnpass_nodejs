const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const config = require('../../config/config');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.get('/get-phone-number', validate(authValidation.getPhoneNumber), authController.getPhoneNumber);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
if (config.env === 'development') {
  router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
  router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
  router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
  router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
}

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domain
 *               - phoneNumber
 *               - msisdn
 *             properties:
 *               domain:
 *                 type: string
 *                 description: The domain of the user, ie. gtalk
 *               displayName:
 *                 type: string
 *                 description: The user full name
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number that user currently used (begin with +)
 *               eid:
 *                 type: string
 *                 description: User identification number
 *               eidIssuedDate:
 *                 type: date
 *                 description: Date when eid is issued
 *               eidIssuedBy:
 *                 type: string
 *                 description: Place that issued the eid
 *               dateOfBirth:
 *                 type: date
 *                 description: Date when eid is issued
 *               placeOfOrigin:
 *                 type: string
 *                 description: Place that issued the eid
 *               gender:
 *                 type: string
 *                 description: User gender (male or female)
 *               email:
 *                 type: string
 *                 description: User email
 *               msisdn:
 *                 type: string
 *                 description: Gmobile selected virtual number
 *               fcmToken:
 *                 type: string
 *                 description: FCM token of the client application
 *               deviceUid:
 *                 type: string
 *                 description: Unique identifier of the device
 *               deviceName:
 *                 type: string
 *                 description: Name of the mobile device
 *               devicePlatform:
 *                 type: string
 *                 description: OS platform of the device (iOS/Android)
 *               isKyc:
 *                 type: boolean
 *                 description: Whether the user has been through eKyc
 *             example:
 *               domain: "gtalk"
 *               displayName: "Dat Kieu"
 *               phoneNumber: "+84792471111"
 *               eid: "001087009651"
 *               eidIssuedDate: "2021-12-17T17:00:00.000Z"
 *               eidIssuedBy: "Công An thành phố Hà Nội"
 *               dateOfBirth: "1987-04-01T17:00:00.000Z"
 *               placeOfOrigin: "Phú Thịnh, Thị xã Sơn Tây, Hà Nội"
 *               gender: "male"
 *               email: "gvasmen@gmail.com"
 *               avatarUrl: "https://i.pravatar.cc/400?img=52"
 *               msisdn: "84598000193"
 *               fcmToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2NhMDhhOTNkMjEyZTAwMmZlZTRmODUiLCJpYXQiOjE2Nzg4NDYyNzksImV4cCI6MTY3ODkzMjY3OSwidHlwZSI6ImFjY2VzcyJ9.6Am1Au-S9RhX9aunKPGP0wdSvhwavv-KNQmyGeTlEpM"
 *               deviceUid: "67cec3a3-8720-4c81-8312-0674d8681c1b"
 *               deviceName: "Samsung S20 Ultra 5G"
 *               devicePlatform: "Android"
 *               isKyc: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/get-phone-number:
 *   get:
 *     summary: Get the phone number registered for the msisdn
 *     description: Get the phone number registered for the msisdn.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: msisdn
 *         required: true
 *         schema:
 *           type: string
 *         description: Msisdn number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - msisdn
 *               - firebaseUid
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 format: User phone number with Firebase
 *               msisdn:
 *                 type: string
 *                 format: User registered msisdn
 *               firebaseUid:
 *                 type: string
 *                 format: User Firebase UID
 *               fcmToken:
 *                 type: string
 *                 format: User Firebase FCM Token (for notification)
 *             example:
 *               phoneNumber: "+84375187726"
 *               msisdn: "84593000021"
 *               firebaseUid: "m96skXvIBPOtfWPwKSbive7JueU2"
 *               fcmToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2NhMDhhOTNkMjEyZTAwMmZlZTRmODUiLCJpYXQiOjE2Nzg4NDYyNzksImV4cCI6MTY3ODkzMjY3OSwidHlwZSI6ImFjY2VzcyJ9.6Am1Au-S9RhX9aunKPGP0wdSvhwavv-KNQmyGeTlEpM"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid credential
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid credential
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - refreshToken
 *             properties:
 *               userId:
 *                 type: string
 *               refreshToken:
 *                 type: string
 *             example:
 *               userId: 642e88abcc6ef1622420fff3
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

// /**
//  * @swagger
//  * /auth/forgot-password:
//  *   post:
//  *     summary: Forgot password
//  *     description: An email will be sent to reset password.
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - email
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 format: email
//  *             example:
//  *               email: fake@example.com
//  *     responses:
//  *       "204":
//  *         description: No content
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  */
//
// /**
//  * @swagger
//  * /auth/reset-password:
//  *   post:
//  *     summary: Reset password
//  *     tags: [Auth]
//  *     parameters:
//  *       - in: query
//  *         name: token
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The reset password token
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - password
//  *             properties:
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 minLength: 8
//  *                 description: At least one number and one letter
//  *             example:
//  *               password: password1
//  *     responses:
//  *       "204":
//  *         description: No content
//  *       "401":
//  *         description: Password reset failed
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  *             example:
//  *               code: 401
//  *               message: Password reset failed
//  */
//
// /**
//  * @swagger
//  * /auth/send-verification-email:
//  *   post:
//  *     summary: Send verification email
//  *     description: An email will be sent to verify email.
//  *     tags: [Auth]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       "204":
//  *         description: No content
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  */
//
// /**
//  * @swagger
//  * /auth/verify-email:
//  *   post:
//  *     summary: verify email
//  *     tags: [Auth]
//  *     parameters:
//  *       - in: query
//  *         name: token
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The verify email token
//  *     responses:
//  *       "204":
//  *         description: No content
//  *       "401":
//  *         description: verify email failed
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Error'
//  *             example:
//  *               code: 401
//  *               message: verify email failed
//  */
