const EventService = require('../services/eventService');

class EventController {
  static async getAll(req, res, next) {
    try {
      const events = await EventService.listEvents();
      res.json(events);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const event = await EventService.getEventById(req.params.id);
      res.json(event);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const created = await EventService.createEvent(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const updated = await EventService.updateEvent(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

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