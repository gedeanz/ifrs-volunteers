const db = require("../config/database");

class EventModel {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT id, title, description, event_date, location, capacity, created_at
       FROM events
       ORDER BY event_date ASC`
    );
    return rows;
  }
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
  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, title, description, event_date, location, capacity, created_at
     FROM events WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0];
  }

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

  static async remove(id) {
    const [result] = await db.execute("DELETE FROM events WHERE id = ?", [id]);
    return result.affectedRows === 1;
  }
}

module.exports = EventModel;
