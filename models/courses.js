const pool = require('../db');

async function createCourse(courseName, units) {
  const result = await pool.query(
    'INSERT INTO courses (course_name, units) VALUES ($1, $2) RETURNING *',
    [courseName, units]
  );
  return result.rows[0];
}

async function getCourses() {
  const result = await pool.query('SELECT * FROM courses');
  return result.rows;
}

module.exports = { createCourse, getCourses };
