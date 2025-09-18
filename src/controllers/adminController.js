const DashboardService = require('../services/dashboardService');

class AdminController {
  static async overview(req, res, next) {
    try {
      const summary = await DashboardService.getSummary();
      res.json({ admin: true, summary });
    } catch (err) { next(err); }
  }
}

module.exports = AdminController;