const EventModel = require('../models/eventModel');

class EventService {
  static async listEvents() {
    // Regras de negócio futuras vão aqui
    return EventModel.findAll();
  }
  static async createEvent(payload) {
    const { title, event_date, location } = payload || {};
    if (!title || !event_date || !location) {
      const err = new Error('title, event_date e location são obrigatórios');
      err.status = 400;
      throw err;
    }
    // Enviar 'YYYY-MM-DD HH:MM:SS' para compatibilizar com DATETIME do MySQL
    return EventModel.create(payload);
  }
}

module.exports = EventService;