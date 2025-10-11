const express = require('express');
const RegistrationController = require('../controllers/registrationController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

/**
 * @openapi
 * /my-registrations:
 *   get:
 *     tags: [Registrations]
 *     summary: Lista minhas inscrições em eventos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos inscritos
 */
router.get('/my-registrations', authenticate, RegistrationController.getMyRegistrations);

module.exports = router;
