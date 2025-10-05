const VolunteerService = require('../services/volunteerService');

class VolunteerController {
  static async getAll(req, res, next) {
    try {
      const volunteers = await VolunteerService.listVolunteers();
      res.json(volunteers);
    } catch (err) {
      next(err);
    }
  }

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

  static async create(req, res, next) {
    try {
      const created = await VolunteerService.createVolunteer(req.body);
      res.status(201).json({ message: 'Voluntário criado com sucesso', data: created });
    } catch (err) {
      next(err);
    }
  }

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
