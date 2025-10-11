const bcrypt = require('bcrypt');
const VolunteerModel = require('../models/volunteerModel');

/**
 * Service responsável pelas regras de negócio relacionadas a voluntários
 */
class VolunteerService {
  /**
   * Lista todos os voluntários cadastrados
   * @returns {Promise<Array>} Array de voluntários
   */
  static async listVolunteers() {
    return VolunteerModel.findAll();
  }

  /**
   * Busca um voluntário por ID com controle de permissão
   * @param {number|string} id - ID do voluntário
   * @param {number} requestingUserId - ID do usuário que está fazendo a requisição
   * @param {string} requestingUserRole - Role do usuário que está fazendo a requisição
   * @returns {Promise<Object>} Dados do voluntário
   * @throws {Error} Lança erro 404 se não encontrado, 403 se sem permissão
   */
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

  /**
   * Cria um novo voluntário com validações e hash de senha
   * @param {Object} payload - Dados do voluntário
   * @param {string} payload.name - Nome do voluntário (obrigatório)
   * @param {string} payload.email - Email do voluntário (obrigatório)
   * @param {string} payload.password - Senha em texto plano (obrigatório)
   * @param {string} [payload.phone] - Telefone do voluntário
   * @param {string} [payload.role] - Role do voluntário (padrão: 'user')
   * @returns {Promise<Object>} Voluntário criado
   * @throws {Error} Lança erro 400 se campos obrigatórios ausentes, 409 se email já cadastrado
   */
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

    const hashedPassword = await bcrypt.hash(password, 10);
    return VolunteerModel.create({ ...payload, password: hashedPassword });
  }

  /**
   * Atualiza um voluntário com controle de permissão
   * @param {number|string} id - ID do voluntário
   * @param {Object} payload - Dados atualizados
   * @param {string} payload.name - Nome do voluntário (obrigatório)
   * @param {string} payload.email - Email do voluntário (obrigatório)
   * @param {string} [payload.phone] - Telefone do voluntário
   * @param {string} [payload.role] - Role do voluntário
   * @param {string} [payload.password] - Nova senha (será hasheada)
   * @param {number} requestingUserId - ID do usuário que está fazendo a requisição
   * @param {string} requestingUserRole - Role do usuário que está fazendo a requisição
   * @returns {Promise<Object>} Voluntário atualizado
   * @throws {Error} Lança erro 400 se campos obrigatórios ausentes, 403 se sem permissão, 404 se não encontrado, 409 se email em uso
   */
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

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    const success = await VolunteerModel.update(id, payload);
    if (!success) {
      const err = new Error('Erro ao atualizar voluntário');
      err.status = 500;
      throw err;
    }

    return this.getVolunteerById(id, requestingUserId, requestingUserRole);
  }

  /**
   * Remove um voluntário com controle de permissão
   * @param {number|string} id - ID do voluntário
   * @param {number} requestingUserId - ID do usuário que está fazendo a requisição
   * @param {string} requestingUserRole - Role do usuário que está fazendo a requisição
   * @returns {Promise<void>}
   * @throws {Error} Lança erro 403 se sem permissão, 404 se não encontrado, 500 se falhar ao remover
   */
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
