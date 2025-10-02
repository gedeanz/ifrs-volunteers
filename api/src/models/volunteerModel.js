const db = require('../config/database');

class VolunteerModel {
  static async findAll() {
    const [rows] = await db.query(
      `SELECT id, name, email, phone, role, created_at
       FROM volunteers
       ORDER BY name ASC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, role, created_at
       FROM volunteers
       WHERE id = ?
       LIMIT 1`,
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, role, password, created_at
       FROM volunteers
       WHERE email = ?
       LIMIT 1`,
      [email]
    );
    return rows[0];
  }

  static async create({ name, email, phone, role, password }) {
    const sql = `
      INSERT INTO volunteers (name, email, phone, role, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [name, email, phone ?? null, role ?? 'user', password];
    const [result] = await db.execute(sql, params);
    return {
      id: result.insertId,
      name,
      email,
      phone,
      role: role ?? 'user',
    };
  }

  static async update(id, { name, email, phone, role, password }) {
    let sql, params;
    if (password) {
      sql = `
        UPDATE volunteers
        SET name = ?, email = ?, phone = ?, role = ?, password = ?
        WHERE id = ?
      `;
      params = [name, email, phone ?? null, role ?? 'user', password, id];
    } else {
      sql = `
        UPDATE volunteers
        SET name = ?, email = ?, phone = ?, role = ?
        WHERE id = ?
      `;
      params = [name, email, phone ?? null, role ?? 'user', id];
    }
    const [result] = await db.execute(sql, params);
    return result.affectedRows === 1;
  }

  static async remove(id) {
    const [result] = await db.execute('DELETE FROM volunteers WHERE id = ?', [id]);
    return result.affectedRows === 1;
  }
}

module.exports = VolunteerModel;
