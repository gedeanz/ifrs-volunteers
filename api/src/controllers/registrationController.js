const RegistrationService = require('../services/registrationService');

class RegistrationController {
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

  static async getMyRegistrations(req, res, next) {
    try {
      const volunteerId = req.user.id;
      const registrations = await RegistrationService.getMyRegistrations(volunteerId);
      return res.json(registrations);
    } catch (err) {
      next(err);
    }
  }

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
