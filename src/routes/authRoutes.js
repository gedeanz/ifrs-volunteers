const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autentica usuário e retorna um JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@ifrs.edu" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Token emitido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', AuthController.login);

module.exports = router;