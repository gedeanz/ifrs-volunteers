const DashboardService = require('../services/dashboardService');

/**
 * Controller responsável por fornecer dados do dashboard para usuários autenticados
 */
class DashboardController {
  /**
   * Retorna resumo de estatísticas do sistema para o usuário autenticado
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} req.user - Dados do usuário autenticado
   * @param {string} req.user.email - Email do usuário
   * @param {string} req.user.role - Role do usuário
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função para passar erros ao middleware de erro
   * @returns {Promise<void>} Retorna JSON com dados do usuário e resumo de estatísticas
   */
  static async getSummary(req, res, next) {
    try {
      const summary = await DashboardService.getSummary();
      res.json({ user: { email: req.user.email, role: req.user.role }, summary });
    } catch (err) { next(err); }
  }
}

module.exports = DashboardController;