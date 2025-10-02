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
 *       401: { description: Token ausente/inválido }
 *       403: { description: Sem permissão }
 */
router.post('/', authenticate, authorize('admin'), EventController.create);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     summary: Busca evento por ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200: { description: Evento encontrado }
 *       404: { description: Evento não encontrado }
 */
router.get('/:id', EventController.getById);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     summary: Atualiza evento (apenas admin)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
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
 *       200: { description: Evento atualizado }
 *       400: { description: Dados inválidos }
 *       404: { description: Evento não encontrado }
 *       401: { description: Token ausente/inválido }
 *       403: { description: Sem permissão }
 */
router.put('/:id', authenticate, authorize('admin'), EventController.update);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     summary: Remove evento (apenas admin)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200: 
 *         description: Evento removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Evento removido com sucesso" }
 *       404: { description: Evento não encontrado }
 *       401: { description: Token ausente/inválido }
 *       403: { description: Sem permissão }
 */
router.delete('/:id', authenticate, authorize('admin'), EventController.remove);

module.exports = router;