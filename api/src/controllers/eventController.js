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
  static async create(req, res, next) {
    try {
      const created = await EventService.createEvent(req.body);
      res.status(201).json(created);
    } catch (err) { next(err); }
  }
}

module.exports = EventController;