const RegistrationService = require('../services/registrationService');

/**
 * Controller responsável por gerenciar inscrições em eventos
 */
class RegistrationController {
  /**
   * Inscreve o voluntário autenticado em um evento
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do evento
   * @param {Object} req.user - Dados do usuário autenticado (injetado pelo middleware)
   * @param {number} req.user.id - ID do voluntário
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com mensagem de sucesso (status 201) ou erro 400
   */
  static async register(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);
      const volunteerId = req.user.id;

      const result = await RegistrationService.register(eventId, volunteerId);
      return res.status(201).json(result);
    } catch (err) {
      if (err.message.includes('não encontrado') || 
          err.message.includes('já está inscrito') ||
          err.message.includes('não há mais vagas')) {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }

  /**
   * Cancela a inscrição do voluntário em um evento
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do evento
   * @param {Object} req.user - Dados do usuário autenticado
   * @param {number} req.user.id - ID do voluntário
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com mensagem de sucesso ou erro 400
   */
  static async unregister(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);
      const volunteerId = req.user.id;

      const result = await RegistrationService.unregister(eventId, volunteerId);
      return res.json(result);
    } catch (err) {
      if (err.message.includes('não está inscrito')) {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }

  /**
   * Lista todas as inscrições do voluntário autenticado
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.user - Dados do usuário autenticado
   * @param {number} req.user.id - ID do voluntário
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com array de inscrições
   */
  static async getMyRegistrations(req, res, next) {
    try {
      const volunteerId = req.user.id;
      const registrations = await RegistrationService.getMyRegistrations(volunteerId);
      return res.json(registrations);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Lista todos os voluntários inscritos em um evento (apenas admin)
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do evento
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com array de inscrições do evento
   */
  static async getEventRegistrations(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);
      const registrations = await RegistrationService.getEventRegistrations(eventId);
      return res.json(registrations);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RegistrationController;
