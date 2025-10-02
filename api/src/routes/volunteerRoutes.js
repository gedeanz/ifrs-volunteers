const express = require('express');
const VolunteerController = require('../controllers/volunteerController');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @openapi
 * /volunteers:
 *   get:
 *     summary: Lista todos os voluntários (apenas admin)
 *     tags:
 *       - Volunteers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de voluntários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: integer, example: 1 }
 *                   name: { type: string, example: "João Silva" }
 *                   email: { type: string, example: "joao@ifrs.edu" }
 *                   phone: { type: string, example: "(51) 99999-0000" }
 *                   role: { type: string, enum: [admin, user], example: "user" }
 *                   created_at: { type: string, format: date-time }
 *       401: { description: Token ausente/inválido }
 *       403: { description: Sem permissão }
 */
router.get('/', authenticate, authorize('admin'), VolunteerController.getAll);

/**
 * @openapi
 * /volunteers/{id}:
 *   get:
 *     summary: Busca voluntário por ID (admin pode ver todos, user pode ver apenas seu perfil)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *     responses:
 *       200:
 *         description: Voluntário encontrado
 *       403: { description: Sem permissão para ver este perfil }
 *       404: { description: Voluntário não encontrado }
 */
router.get('/:id', authenticate, VolunteerController.getById);

/**
 * @openapi
 * /volunteers:
 *   post:
 *     summary: Cadastro de novo voluntário (público - qualquer pessoa pode se cadastrar)
 *     tags: [Volunteers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Maria Santos" }
 *               email: { type: string, example: "maria@ifrs.edu" }
 *               phone: { type: string, example: "(54) 99999-0000" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201: { description: Voluntário criado }
 *       400: { description: Dados inválidos }
 *       409: { description: Email já cadastrado }
 */
router.post('/', VolunteerController.create);

/**
 * @openapi
 * /volunteers/{id}:
 *   put:
 *     summary: Atualiza voluntário (admin pode editar todos, user pode editar apenas seu perfil)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, example: "Maria Santos" }
 *               email: { type: string, example: "maria@ifrs.edu" }
 *               phone: { type: string, example: "(54) 99999-0000" }
 *               role: { type: string, enum: [admin, user], example: "user" }
 *               password: { type: string, example: "123456", description: "Opcional" }
 *     responses:
 *       200: { description: Voluntário atualizado }
 *       400: { description: Dados inválidos }
 *       403: { description: Sem permissão para editar este perfil }
 *       404: { description: Voluntário não encontrado }
 *       409: { description: Email já cadastrado }
 */
router.put('/:id', authenticate, VolunteerController.update);

/**
 * @openapi
 * /volunteers/{id}:
 *   delete:
 *     summary: Remove voluntário (admin pode deletar qualquer um, user pode deletar apenas seu perfil)
 *     tags: [Volunteers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do voluntário
 *     responses:
 *       200: 
 *         description: Voluntário removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Voluntário removido com sucesso" }
 *       403: { description: Sem permissão para deletar este perfil }
 *       404: { description: Voluntário não encontrado }
 */
router.delete('/:id', authenticate, VolunteerController.remove);

module.exports = router;
