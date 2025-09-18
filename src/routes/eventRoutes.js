const express = require('express');
const EventController = require('../controllers/eventController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @openapi
 * /events:
 *   get:
 *     summary: Lista eventos de voluntariado
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   title: { type: string, example: "Doação de Sangue" }
 *                   description: { type: string, example: "Campanha no hospital" }
 *                   event_date: { type: string, format: date-time }
 *                   location: { type: string, example: "Hospital Municipal" }
 *                   capacity: { type: integer, example: 80 }
 */
router.get('/', EventController.getAll);

/**
 * @openapi
 * /events:
 *   post:
 *     summary: Cria um novo evento (apenas admin)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, event_date, location]
 *             properties:
 *               title: { type: string, example: "Feira de Adoção" }
 *               description: { type: string, example: "No parque municipal" }
 *               event_date: { type: string, example: "2025-10-26 09:00:00" }
 *               location: { type: string, example: "Parque Municipal" }
 *               capacity: { type: integer, example: 40 }
 *     responses:
 *       201: { description: Criado }
 *       401: { description: Token ausente/ inválido }
 *       403: { description: Sem permissão }
 */
router.post('/', authenticate, authorize('admin'), EventController.create);

module.exports = router;