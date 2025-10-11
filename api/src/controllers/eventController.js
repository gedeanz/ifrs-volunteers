const EventService = require('../services/eventService');

/**
 * Controller responsável por gerenciar requisições relacionadas a eventos
 */
class EventController {
  /**
   * Lista todos os eventos disponíveis
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com array de eventos
   */
  static async getAll(req, res, next) {
    try {
      const events = await EventService.listEvents();
      res.json(events);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Busca um evento específico por ID
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do evento
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com dados do evento
   */
  static async getById(req, res, next) {
    try {
      const event = await EventService.getEventById(req.params.id);
      res.json(event);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Cria um novo evento (apenas admin)
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.body - Dados do evento (title, description, event_date, location, capacity)
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com mensagem de sucesso e dados do evento criado (status 201)
   */
  static async create(req, res, next) {
    try {
      const created = await EventService.createEvent(req.body);
      res.status(201).json({ message: 'Evento criado com sucesso', data: created });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Atualiza um evento existente (apenas admin)
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do evento
   * @param {Object} req.body - Dados atualizados do evento
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com dados do evento atualizado
   */
  static async update(req, res, next) {
    try {
      const updated = await EventService.updateEvent(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Remove um evento (apenas admin)
   * @param {Object} req - Objeto de requisição Express
   * @param {string} req.params.id - ID do evento
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com mensagem de sucesso (status 200)
   */
  static async remove(req, res, next) {
    try {
      await EventService.deleteEvent(req.params.id);
      res.status(200).json({ message: 'Evento removido com sucesso' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventController;