const EventModel = require('../models/eventModel');

/**
 * Service responsável pelas regras de negócio relacionadas a eventos
 */
class EventService {
  /**
   * Lista todos os eventos cadastrados
   * @returns {Promise<Array>} Array de eventos com contagem de inscritos
   */
  static async listEvents() {
    return EventModel.findAll();
  }

  /**
   * Busca um evento específico por ID
   * @param {number|string} id - ID do evento
   * @returns {Promise<Object>} Dados do evento
   * @throws {Error} Lança erro 404 se evento não for encontrado
   */
  static async getEventById(id) {
    const event = await EventModel.findById(id);
    if (!event) {
      const err = new Error('Evento não encontrado');
      err.status = 404;
      throw err;
    }
    return event;
  }

  /**
   * Cria um novo evento com validações
   * @param {Object} payload - Dados do evento
   * @param {string} payload.title - Título do evento (obrigatório)
   * @param {string} payload.event_date - Data/hora do evento (obrigatório)
   * @param {string} payload.location - Local do evento (obrigatório)
   * @param {string} [payload.description] - Descrição do evento
   * @param {number} [payload.capacity] - Capacidade máxima de participantes
   * @returns {Promise<Object>} Evento criado
   * @throws {Error} Lança erro 400 se campos obrigatórios estiverem ausentes ou data inválida
   */
  static async createEvent(payload) {
    const { title, event_date, location } = payload || {};
    if (!title || !event_date || !location) {
      const err = new Error('title, event_date e location são obrigatórios');
      err.status = 400;
      throw err;
    }

    // Valida se a data/hora não está no passado
    const eventDateTime = new Date(event_date);
    const now = new Date();
    
    if (eventDateTime < now) {
      const err = new Error('Não é possível criar eventos com data/horário que já passaram');
      err.status = 400;
      throw err;
    }

    return EventModel.create(payload);
  }

  /**
   * Atualiza um evento existente
   * @param {number|string} id - ID do evento
   * @param {Object} payload - Dados atualizados do evento
   * @param {string} payload.title - Título do evento (obrigatório)
   * @param {string} payload.event_date - Data/hora do evento (obrigatório)
   * @param {string} payload.location - Local do evento (obrigatório)
   * @param {string} [payload.description] - Descrição do evento
   * @param {number} [payload.capacity] - Capacidade máxima de participantes
   * @returns {Promise<Object>} Evento atualizado
   * @throws {Error} Lança erro 400 se campos obrigatórios estiverem ausentes, 404 se não encontrado
   */
  static async updateEvent(id, payload) {
    const { title, event_date, location } = payload || {};
    if (!title || !event_date || !location) {
      const err = new Error('title, event_date e location são obrigatórios');
      err.status = 400;
      throw err;
    }

    await this.getEventById(id);

    const success = await EventModel.update(id, payload);
    if (!success) {
      const err = new Error('Erro ao atualizar evento');
      err.status = 500;
      throw err;
    }

    return this.getEventById(id);
  }

  /**
   * Remove um evento do sistema
   * @param {number|string} id - ID do evento
   * @returns {Promise<void>}
   * @throws {Error} Lança erro 404 se evento não for encontrado, 500 se falhar ao remover
   */
  static async deleteEvent(id) {
    await this.getEventById(id);

    const success = await EventModel.remove(id);
    if (!success) {
      const err = new Error('Erro ao remover evento');
      err.status = 500;
      throw err;
    }
  }
}

module.exports = EventService;