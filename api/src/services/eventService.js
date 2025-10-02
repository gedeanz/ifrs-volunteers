const EventModel = require('../models/eventModel');

class EventService {
  static async listEvents() {
    return EventModel.findAll();
  }

  static async getEventById(id) {
    const event = await EventModel.findById(id);
    if (!event) {
      const err = new Error('Evento não encontrado');
      err.status = 404;
      throw err;
    }
    return event;
  }

  static async createEvent(payload) {
    const { title, event_date, location } = payload || {};
    if (!title || !event_date || !location) {
      const err = new Error('title, event_date e location são obrigatórios');
      err.status = 400;
      throw err;
    }
    return EventModel.create(payload);
  }

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