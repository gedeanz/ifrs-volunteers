const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const AdminController = require('../controllers/adminController');

const router = express.Router();

/**
 * @openapi
 * /admin:
 *   get:
 *     summary: Área administrativa (apenas admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *       401: { description: Token ausente/ inválido }
 *       403: { description: Sem permissão }
 */
router.get('/', authenticate, authorize('admin'), AdminController.overview);

module.exports = router;