const DashboardService = require('../services/dashboardService');

class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const summary = await DashboardService.getSummary();
      res.json({ user: { email: req.user.email, role: req.user.role }, summary });
    } catch (err) { next(err); }
  }
}

module.exports = DashboardController;