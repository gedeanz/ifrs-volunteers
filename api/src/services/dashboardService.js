const DashboardModel = require('../models/dashboardModel');

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
    return DashboardModel.getSummary();
  }
}

module.exports = DashboardService;