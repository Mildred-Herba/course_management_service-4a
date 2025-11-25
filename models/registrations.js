const pool = require('../db');

async function registerUserToCourse(userId, courseId) {
  const result = await pool.query(
    'INSERT INTO registrations (user_id, course_id) VALUES ($1, $2) RETURNING *',
    [userId, courseId]
  );
  return result.rows[0];
}

async function getRegistrations() {
  const result = await pool.query(
    'SELECT r.id, u.name AS user_name, c.course_name, r.registered_at ' +
    'FROM registrations r ' +
    'JOIN users u ON r.user_id = u.id ' +
    'JOIN courses c ON r.course_id = c.id'
  );
  return result.rows;
}

module.exports = { registerUserToCourse, getRegistrations };
