const db = require("../config/database");

/**
 * Model responsável pelo acesso aos dados de eventos no banco
 */
class EventModel {
  /**
   * Busca todos os eventos com contagem de inscritos
   * @returns {Promise<Array>} Array de eventos ordenados por data
   */
  static async findAll() {
    const [rows] = await db.query(
      `SELECT 
        e.id, 
        e.title, 
        e.description, 
        e.event_date, 
        e.location, 
        e.capacity, 
        e.created_at,
        COUNT(er.id) as registered_count
       FROM events e
       LEFT JOIN event_registrations er ON e.id = er.event_id
       GROUP BY e.id
       ORDER BY e.event_date ASC`
    );
    return rows;
  }
  /**
   * Cria um novo evento no banco de dados
   * @param {Object} params - Parâmetros do evento
   * @param {string} params.title - Título do evento
   * @param {string} params.description - Descrição do evento
   * @param {string} params.event_date - Data/hora do evento
   * @param {string} params.location - Local do evento
   * @param {number} params.capacity - Capacidade máxima
   * @returns {Promise<Object>} Evento criado com ID
   */
  static async create({ title, description, event_date, location, capacity }) {
    const sql = `
      INSERT INTO events (title, description, event_date, location, capacity)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      title,
      description ?? null,
      event_date,
      location,
      capacity ?? 0,
    ];
    const [result] = await db.execute(sql, params);
    return {
      id: result.insertId,
      title,
      description,
      event_date,
      location,
      capacity: capacity ?? 0,
    };
  }
  /**
   * Busca um evento específico por ID
   * @param {number|string} id - ID do evento
   * @returns {Promise<Object|undefined>} Dados do evento ou undefined se não encontrado
   */
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, title, description, event_date, location, capacity, created_at
     FROM events WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0];
  }

  /**
   * Atualiza um evento existente
   * @param {number|string} id - ID do evento
   * @param {Object} params - Dados atualizados
   * @param {string} params.title - Título do evento
   * @param {string} params.description - Descrição do evento
   * @param {string} params.event_date - Data/hora do evento
   * @param {string} params.location - Local do evento
   * @param {number} params.capacity - Capacidade máxima
   * @returns {Promise<boolean>} true se atualizado com sucesso
   */
  static async update(
    id,
    { title, description, event_date, location, capacity }
  ) {
    const sql = `
    UPDATE events
       SET title = ?, description = ?, event_date = ?, location = ?, capacity = ?
     WHERE id = ?
  `;
    const params = [
      title,
      description ?? null,
      event_date,
      location,
      capacity ?? 0,
      id,
    ];
    const [result] = await db.execute(sql, params);
    return result.affectedRows === 1;
  }

  /**
   * Remove um evento do banco de dados
   * @param {number|string} id - ID do evento
   * @returns {Promise<boolean>} true se removido com sucesso
   */
  static async remove(id) {
    const [result] = await db.execute("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows === 1;
  }
}

module.exports = EventModel;
