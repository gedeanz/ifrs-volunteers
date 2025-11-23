const prisma = require('../config/prisma');

function mapVolunteer(volunteer) {
  if (!volunteer) {
    return undefined;
  }

  return {
    id: volunteer.id,
    name: volunteer.name,
    email: volunteer.email,
    phone: volunteer.phone,
    role: volunteer.role,
    password: volunteer.password,
    created_at: volunteer.createdAt,
  };
}

/**
 * Model responsável pelo acesso aos dados de voluntários no banco
 */
class VolunteerModel {
  /**
   * Busca todos os voluntários cadastrados
   * @returns {Promise<Array>} Array de voluntários ordenados por nome
   */
  static async findAll() {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { name: 'asc' },
    });

    return volunteers.map((volunteer) => {
      const { password, ...rest } = mapVolunteer(volunteer);
      return rest;
    });
  }

  /**
   * Busca um voluntário específico por ID
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<Object|undefined>} Dados do voluntário (sem senha) ou undefined se não encontrado
   */
  static async findById(id) {
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: Number(id) },
    });

    const mapped = mapVolunteer(volunteer);
    if (!mapped) {
      return undefined;
    }

    const { password, ...rest } = mapped;
    return rest;
  }

  /**
   * Busca um voluntário por email (inclui senha para autenticação)
   * @param {string} email - Email do voluntário
   * @returns {Promise<Object|undefined>} Dados do voluntário (com senha) ou undefined se não encontrado
   */
  static async findByEmail(email) {
    const volunteer = await prisma.volunteer.findUnique({
      where: { email },
    });

    return mapVolunteer(volunteer);
  }

  /**
   * Cria um novo voluntário no banco de dados
   * @param {Object} params - Parâmetros do voluntário
   * @param {string} params.name - Nome do voluntário
   * @param {string} params.email - Email do voluntário
   * @param {string} params.phone - Telefone do voluntário
   * @param {string} params.role - Role do voluntário (user ou admin)
   * @param {string} params.password - Senha hasheada
   * @returns {Promise<Object>} Voluntário criado com ID
   */
  static async create({ name, email, phone, role, password }) {
    const volunteer = await prisma.volunteer.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        role: role ?? 'user',
        password,
      },
    });

    const mapped = mapVolunteer(volunteer);
    const { password: _, ...rest } = mapped;
    return rest;
  }

  /**
   * Atualiza um voluntário existente
   * @param {number|string} id - ID do voluntário
   * @param {Object} params - Dados atualizados
   * @param {string} params.name - Nome do voluntário
   * @param {string} params.email - Email do voluntário
   * @param {string} params.phone - Telefone do voluntário
   * @param {string} params.role - Role do voluntário
   * @param {string} [params.password] - Senha hasheada (opcional)
   * @returns {Promise<boolean>} true se atualizado com sucesso
   */
  static async update(id, { name, email, phone, role, password }) {
    const dataToUpdate = {
      name,
      email,
      phone: phone ?? null,
      role: role ?? 'user',
    };

    if (password) {
      dataToUpdate.password = password;
    }

    await prisma.volunteer.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return true;
  }

  /**
   * Remove um voluntário do banco de dados
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  static async remove(id) {
    await prisma.volunteer.delete({
      where: { id: Number(id) },
    });

    return true;
  }
}

module.exports = VolunteerModel;
