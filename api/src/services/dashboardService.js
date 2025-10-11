const db = require('../config/database');

/**
 * Service responsável por agregar estatísticas do sistema
 */
class DashboardService {
  /**
   * Retorna resumo de estatísticas gerais do sistema
   * @returns {Promise<Object>} Objeto com estatísticas
   * @returns {number} return.total_events - Total de eventos cadastrados
   * @returns {number} return.total_volunteers - Total de voluntários cadastrados
   * @returns {number} return.total_capacity - Soma da capacidade de todos os eventos
   * @returns {Array} return.upcoming - Lista dos próximos 5 eventos
   */
  static async getSummary() {
    const [countRows] = await db.query('SELECT COUNT(*) AS total_events FROM events');
    const total_events = countRows[0]?.total_events ?? 0;

    const [volRows] = await db.query('SELECT COUNT(*) AS total_volunteers FROM volunteers');
    const total_volunteers = volRows[0]?.total_volunteers ?? 0;

    const [capRows] = await db.query('SELECT COALESCE(SUM(capacity),0) AS total_capacity FROM events');
    const total_capacity = capRows[0]?.total_capacity ?? 0;

    const [upcoming] = await db.query(
      `SELECT id, title, event_date, location
         FROM events
        WHERE event_date >= NOW()
        ORDER BY event_date ASC
        LIMIT 5`
    );

    return { total_events, total_volunteers, total_capacity, upcoming };
  }
}

module.exports = DashboardService;