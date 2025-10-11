const DashboardService = require('../services/dashboardService');

/**
 * Controller responsável por fornecer dados administrativos (apenas admin)
 */
class AdminController {
  /**
   * Retorna visão geral do sistema para administradores
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com flag admin e resumo de estatísticas
   */
  static async overview(req, res, next) {
    try {
      const summary = await DashboardService.getSummary();
      res.json({ admin: true, summary });
    } catch (err) { next(err); }
  }
}

module.exports = AdminController;