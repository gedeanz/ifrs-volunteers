const db = require('../config/database');

class RegistrationModel {
  static async register(eventId, volunteerId) {
    const [result] = await db.query(
      'INSERT INTO event_registrations (event_id, volunteer_id) VALUES (?, ?)',
      [eventId, volunteerId]
    );
    return result;
  }


  static async unregister(eventId, volunteerId) {
    const [result] = await db.query(
      'DELETE FROM event_registrations WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId]
    );
    return result;
  }


  static async isRegistered(eventId, volunteerId) {
    const [rows] = await db.query(
      'SELECT id FROM event_registrations WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId]
    );
    return rows.length > 0;
  }

  static async countRegistrations(eventId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM event_registrations WHERE event_id = ?',
      [eventId]
    );
    return rows[0]?.total || 0;
  }

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
