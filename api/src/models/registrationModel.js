const db = require('../config/database');

/**
 * Model responsável pelo acesso aos dados de inscrições em eventos
 */
class RegistrationModel {
  /**
   * Registra um voluntário em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Resultado da inserção
   */
  static async register(eventId, volunteerId) {
    const [result] = await db.query(
      'INSERT INTO event_registrations (event_id, volunteer_id) VALUES (?, ?)',
      [eventId, volunteerId]
    );
    return result;
  }


  /**
   * Remove a inscrição de um voluntário em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Object>} Resultado da remoção
   */
  static async unregister(eventId, volunteerId) {
    const [result] = await db.query(
      'DELETE FROM event_registrations WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId]
    );
    return result;
  }


  /**
   * Verifica se um voluntário está inscrito em um evento
   * @param {number} eventId - ID do evento
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<boolean>} true se inscrito, false caso contrário
   */
  static async isRegistered(eventId, volunteerId) {
    const [rows] = await db.query(
      'SELECT id FROM event_registrations WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId]
    );
    return rows.length > 0;
  }

  /**
   * Conta o número de inscrições em um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<number>} Total de inscrições
   */
  static async countRegistrations(eventId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM event_registrations WHERE event_id = ?',
      [eventId]
    );
    return rows[0]?.total || 0;
  }

  /**
   * Busca todas as inscrições de um voluntário com dados dos eventos
   * @param {number} volunteerId - ID do voluntário
   * @returns {Promise<Array>} Array de eventos inscritos ordenados por data
   */
  static async getByVolunteer(volunteerId) {
    const [rows] = await db.query(
      `SELECT 
        e.id, e.title, e.description, e.event_date, e.location, e.capacity,
        er.registered_at
       FROM event_registrations er
       INNER JOIN events e ON er.event_id = e.id
       WHERE er.volunteer_id = ?
       ORDER BY e.event_date ASC`,
      [volunteerId]
    );
    return rows;
  }

  /**
   * Busca todos os voluntários inscritos em um evento
   * @param {number} eventId - ID do evento
   * @returns {Promise<Array>} Array de voluntários inscritos ordenados por data de inscrição
   */
  static async getByEvent(eventId) {
    const [rows] = await db.query(
      `SELECT 
        v.id, v.name, v.email, v.phone,
        er.registered_at
       FROM event_registrations er
       INNER JOIN volunteers v ON er.volunteer_id = v.id
       WHERE er.event_id = ?
       ORDER BY er.registered_at ASC`,
      [eventId]
    );
    return rows;
  }
}

module.exports = RegistrationModel;
