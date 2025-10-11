const db = require('../config/database');

/**
 * Model responsável pelo acesso aos dados de voluntários no banco
 */
class VolunteerModel {
  /**
   * Busca todos os voluntários cadastrados
   * @returns {Promise<Array>} Array de voluntários ordenados por nome
   */
  static async findAll() {
    const [rows] = await db.query(
      `SELECT id, name, email, phone, role, created_at
       FROM volunteers
       ORDER BY name ASC`
    );
    return rows;
  }

  /**
   * Busca um voluntário específico por ID
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<Object|undefined>} Dados do voluntário (sem senha) ou undefined se não encontrado
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, role, created_at
       FROM volunteers
       WHERE id = ?
       LIMIT 1`,
      [id]
    );
    return rows[0];
  }

  /**
   * Busca um voluntário por email (inclui senha para autenticação)
   * @param {string} email - Email do voluntário
   * @returns {Promise<Object|undefined>} Dados do voluntário (com senha) ou undefined se não encontrado
   */
  static async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, role, password, created_at
       FROM volunteers
       WHERE email = ?
       LIMIT 1`,
      [email]
    );
    return rows[0];
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
    const sql = `
      INSERT INTO volunteers (name, email, phone, role, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [name, email, phone ?? null, role ?? 'user', password];
    const [result] = await db.execute(sql, params);
    return {
      id: result.insertId,
      name,
      email,
      phone,
      role: role ?? 'user',
    };
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
    let sql, params;
    if (password) {
      sql = `
        UPDATE volunteers
        SET name = ?, email = ?, phone = ?, role = ?, password = ?
        WHERE id = ?
      `;
      params = [name, email, phone ?? null, role ?? 'user', password, id];
    } else {
      sql = `
        UPDATE volunteers
        SET name = ?, email = ?, phone = ?, role = ?
        WHERE id = ?
      `;
      params = [name, email, phone ?? null, role ?? 'user', id];
    }
    const [result] = await db.execute(sql, params);
    return result.affectedRows === 1;
  }

  /**
   * Remove um voluntário do banco de dados
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  static async remove(id) {
    const [result] = await db.execute('DELETE FROM volunteers WHERE id = ?', [id]);
    return result.affectedRows === 1;
  }
}

module.exports = VolunteerModel;
