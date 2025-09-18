const express = require('express');
const { authenticate } = require('../middlewares/auth');
const DashboardController = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @openapi
 * /dashboards:
 *   get:
 *     summary: Resumo de estatísticas (somente autenticado)
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Token ausente/ inválido
 */
router.get('/', authenticate, DashboardController.getSummary);

module.exports = router;