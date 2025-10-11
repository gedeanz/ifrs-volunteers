const VolunteerService = require('../services/volunteerService');

/**
 * Controller responsável por gerenciar requisições relacionadas a voluntários
 */
class VolunteerController {
  /**
   * Lista todos os voluntários (apenas admin)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com array de voluntários
   */
  static async getAll(req, res, next) {
    try {
      const volunteers = await VolunteerService.listVolunteers();
      res.json(volunteers);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Busca um voluntário por ID (admin ou próprio usuário)
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do voluntário
   * @param {Object} req.user - Dados do usuário autenticado
   * @param {number} req.user.id - ID do usuário autenticado
   * @param {string} req.user.role - Role do usuário autenticado
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com dados do voluntário
   */
  static async getById(req, res, next) {
    try {
      const requestingUserId = req.user?.id;
      const requestingUserRole = req.user?.role;
      const volunteer = await VolunteerService.getVolunteerById(
        req.params.id,
        requestingUserId,
        requestingUserRole
      );
      res.json(volunteer);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Cria um novo voluntário (apenas admin)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do voluntário (name, email, phone, role, password)
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com mensagem de sucesso e dados do voluntário criado (status 201)
   */
  static async create(req, res, next) {
    try {
      const created = await VolunteerService.createVolunteer(req.body);
      res.status(201).json({ message: 'Voluntário criado com sucesso', data: created });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Atualiza um voluntário (admin ou próprio usuário)
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do voluntário
   * @param {Object} req.body - Dados atualizados do voluntário
   * @param {Object} req.user - Dados do usuário autenticado
   * @param {number} req.user.id - ID do usuário autenticado
   * @param {string} req.user.role - Role do usuário autenticado
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com dados do voluntário atualizado
   */
  static async update(req, res, next) {
    try {
      const requestingUserId = req.user?.id;
      const requestingUserRole = req.user?.role;
      const updated = await VolunteerService.updateVolunteer(
        req.params.id,
        req.body,
        requestingUserId,
        requestingUserRole
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Remove um voluntário (admin ou próprio usuário)
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do voluntário
   * @param {Object} req.user - Dados do usuário autenticado
   * @param {number} req.user.id - ID do usuário autenticado
   * @param {string} req.user.role - Role do usuário autenticado
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com mensagem de sucesso (status 200)
   */
  static async remove(req, res, next) {
    try {
      const requestingUserId = req.user?.id;
      const requestingUserRole = req.user?.role;
      await VolunteerService.deleteVolunteer(
        req.params.id,
        requestingUserId,
        requestingUserRole
      );
      res.status(200).json({ message: 'Voluntário removido com sucesso' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = VolunteerController;
