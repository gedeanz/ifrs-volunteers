const db = require('../config/database');

class DashboardService {
  static async getSummary() {
    const [countRows] = await db.query('SELECT COUNT(*) AS total_events FROM events');
    const total_events = countRows[0]?.total_events ?? 0;

    const [capRows] = await db.query('SELECT COALESCE(SUM(capacity),0) AS total_capacity FROM events');
    const total_capacity = capRows[0]?.total_capacity ?? 0;

    const [upcoming] = await db.query(
      `SELECT id, title, event_date, location
         FROM events
        WHERE event_date >= NOW()
        ORDER BY event_date ASC
        LIMIT 5`
    );

    return { total_events, total_capacity, upcoming };
  }
}

module.exports = DashboardService;