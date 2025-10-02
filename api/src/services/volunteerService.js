const VolunteerModel = require('../models/volunteerModel');

class VolunteerService {
  static async listVolunteers() {
    return VolunteerModel.findAll();
  }

  static async getVolunteerById(id, requestingUserId, requestingUserRole) {
    const volunteer = await VolunteerModel.findById(id);
    if (!volunteer) {
      const err = new Error('Voluntário não encontrado');
      err.status = 404;
      throw err;
    }

    if (requestingUserRole !== 'admin' && requestingUserId !== parseInt(id)) {
      const err = new Error('Você só pode ver seu próprio perfil');
      err.status = 403;
      throw err;
    }

    return volunteer;
  }

  static async createVolunteer(payload) {
    const { name, email, password } = payload || {};

    if (!name || !email || !password) {
      const err = new Error('name, email e password são obrigatórios');
      err.status = 400;
      throw err;
    }

    const existing = await VolunteerModel.findByEmail(email);
    if (existing) {
      const err = new Error('Email já cadastrado');
      err.status = 409;
      throw err;
    }

    return VolunteerModel.create(payload);
  }

  static async updateVolunteer(id, payload, requestingUserId, requestingUserRole) {
    const { name, email } = payload || {};

    if (!name || !email) {
      const err = new Error('name e email são obrigatórios');
      err.status = 400;
      throw err;
    }

    const existing = await VolunteerModel.findById(id);
    if (!existing) {
      const err = new Error('Voluntário não encontrado');
      err.status = 404;
      throw err;
    }

    if (requestingUserRole !== 'admin' && requestingUserId !== parseInt(id)) {
      const err = new Error('Você só pode editar seu próprio perfil');
      err.status = 403;
      throw err;
    }

    if (email !== existing.email) {
      const emailInUse = await VolunteerModel.findByEmail(email);
      if (emailInUse) {
        const err = new Error('Email já cadastrado');
        err.status = 409;
        throw err;
      }
    }

    const success = await VolunteerModel.update(id, payload);
    if (!success) {
      const err = new Error('Erro ao atualizar voluntário');
      err.status = 500;
      throw err;
    }

    return this.getVolunteerById(id, requestingUserId, requestingUserRole);
  }

  static async deleteVolunteer(id, requestingUserId, requestingUserRole) {
    const existing = await VolunteerModel.findById(id);
    if (!existing) {
      const err = new Error('Voluntário não encontrado');
      err.status = 404;
      throw err;
    }

    if (requestingUserRole !== 'admin' && requestingUserId !== parseInt(id)) {
      const err = new Error('Você só pode deletar seu próprio perfil');
      err.status = 403;
      throw err;
    }

    const success = await VolunteerModel.remove(id);
    if (!success) {
      const err = new Error('Erro ao remover voluntário');
      err.status = 500;
      throw err;
    }
  }
}

module.exports = VolunteerService;
