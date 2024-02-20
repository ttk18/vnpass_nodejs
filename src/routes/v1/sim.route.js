const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const simValidation = require('../../validations/sim.validation');
const simController = require('../../controllers/sim.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageSim'), validate(simValidation.createSim), simController.createSim)
  .get(validate(simValidation.getSims), simController.getSims);
router.route('/prefixes').get(validate(simValidation.getSimPrefixes), simController.getSimPrefixes);
router.route('/search').get(validate(simValidation.searchSims), simController.searchSims);
router
  .route('/:simId')
  .get(validate(simValidation.getSim), simController.getSim)
  .patch(validate(simValidation.updateSim), simController.updateSim)
  .delete(auth('manageSim'), validate(simValidation.deleteSim), simController.deleteSim);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Sims
 *   description: Sim management and retrieval
 */

/**
 * @swagger
 * /sims:
 *   post:
 *     summary: Create a sim record
 *     description: Create a sim with msisdn, vanity, category, phoneRegex, cts.
 *     tags: [Sims]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - msisdn
 *             properties:
 *               domain:
 *                 type: string
 *               prefix:
 *                 type: string
 *               msisdn:
 *                 type: string
 *               phoneRegex:
 *                 type: string
 *               cts:
 *                 type: string
 *               status:
 *                 type: string
 *               telecomStatus:
 *                 type: string
 *               price:
 *                 type: number
 *               assignedUser:
 *                  type: string
 *             example:
 *               prefix: "84593"
 *               msisdn: "84593000021"
 *               phoneRegex: "845930"
 *               cts: "000021"
 *               domain: "gtalk"
 *               status: "new"
 *               telecomStatus: "available"
 *               price: 0.0
 *               assignedUser: "123456abcd"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Sim'
 *       "400":
 *         $ref: '#/components/responses/DuplicateSim'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all the sim
 *     description: Get all the sim based on msisdn, vantiy, category
 *     tags: [Sims]
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         description: App domain
 *       - in: query
 *         name: prefix
 *         schema:
 *           type: string
 *         description: MSISDN prefix
 *       - in: query
 *         name: msisdn
 *         schema:
 *           type: string
 *         description: MSISDN number
 *       - in: query
 *         name: phoneRegex
 *         schema:
 *           type: string
 *         description: First 6 digit number of MSISDN
 *       - in: query
 *         name: cts
 *         schema:
 *           type: string
 *         description: Last 6 digit number of MSISDN
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Sim status
 *       - in: query
 *         name: telecomStatus
 *         schema:
 *           type: string
 *         description: Sim telecom status
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Position of the part of msisdn (contains|beginsWith|endsWith)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of otps
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sim'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /sims/prefixes:
 *   get:
 *     summary: Get all the prefixes of the sim inventory
 *     description: Prefix field
 *     tags: [Sims]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sim'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /sims/search:
 *   get:
 *     summary: Search the sim by provided regex
 *     description: Search field is by msisdn
 *     tags: [Sims]
 *     parameters:
 *       - in: query
 *         name: domain
 *         schema:
 *           type: string
 *         description: App domain
 *       - in: query
 *         name: msisdn
 *         schema:
 *           type: string
 *         description: msisdn value
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of otps
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sim'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /sims/{id}:
 *   get:
 *     summary: Get a specific sim
 *     description: Get a sim by object id.
 *     tags: [Sims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sim id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Sim'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a sim value
 *     description: Update sim value such as vanity, category, phone
 *     tags: [Sims]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedUser:
 *                 type: string
 *               status:
 *                 type: number
 *             example:
 *               assignedUser: 123456abcd
 *               status: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Sim'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a sim
 *     description: Delete a sim by id.
 *     tags: [Sims]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sim id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
