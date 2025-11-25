import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(express.json());


// ito ay PostgreSQL Connection

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_ZxsQ4IA3SfqW@ep-square-water-adoe2auv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false },
});


// ito ay table ng tbl_course_courses

// GET all courses
app.get("/courses", async (req, res) => {
  const result = await pool.query("SELECT * FROM tbl_course_courses");
  res.json(result.rows);
});

// GET course by id
app.get("/courses/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM tbl_course_courses WHERE course_id = $1", [id]);
  res.json(result.rows[0]);
});

// CREATE course
app.post("/courses", async (req, res) => {
  const { course_name } = req.body;
  const result = await pool.query(
    "INSERT INTO tbl_course_courses (course_name) VALUES ($1) RETURNING *",
    [course_name]
  );
  res.json(result.rows[0]);
});

// UPDATE course
app.put("/courses/:id", async (req, res) => {
  const { id } = req.params;
  const { course_name } = req.body;
  const result = await pool.query(
    "UPDATE tbl_course_courses SET course_name=$1, updated_at=NOW() WHERE course_id=$2 RETURNING *",
    [course_name, id]
  );
  res.json(result.rows[0]);
});

// DELETE course
app.delete("/courses/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tbl_course_courses WHERE course_id=$1", [id]);
  res.json({ message: "Course deleted successfully." });
});



// ito ay table ng tbl_course_subject

// GET all subjects
app.get("/subjects", async (req, res) => {
  const result = await pool.query("SELECT * FROM tbl_course_subject");
  res.json(result.rows);
});

// GET subject by id
app.get("/subjects/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM tbl_course_subject WHERE id = $1", [id]);
  res.json(result.rows[0]);
});

// CREATE subject
app.post("/subjects", async (req, res) => {
  const { subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id } = req.body;
  const result = await pool.query(
    `INSERT INTO tbl_course_subject 
      (subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id]
  );
  res.json(result.rows[0]);
});

// UPDATE subject
app.put("/subjects/:id", async (req, res) => {
  const { id } = req.params;
  const { subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id } = req.body;
  const result = await pool.query(
    `UPDATE tbl_course_subject SET
      subject_id=$1, course_name=$2, units=$3, class_time=$4, class_id=$5, instructor_id=$6, pre_requisite=$7, course_id=$8, updated_at=NOW()
     WHERE id=$9 RETURNING *`,
    [subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id, id]
  );
  res.json(result.rows[0]);
});

// DELETE subject
app.delete("/subjects/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tbl_course_subject WHERE id=$1", [id]);
  res.json({ message: "Subject deleted successfully." });
});


// ito ay table ng tbl_course_classes

// GET all classes
app.get("/classes", async (req, res) => {
  const result = await pool.query("SELECT * FROM tbl_course_classes");
  res.json(result.rows);
});

// GET class by id
app.get("/classes/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM tbl_course_classes WHERE id=$1", [id]);
  res.json(result.rows[0]);
});

// CREATE class
app.post("/classes", async (req, res) => {
  const { instructor_id, class_time, slot, room, subject_id } = req.body;
  const result = await pool.query(
    `INSERT INTO tbl_course_classes (instructor_id, class_time, slot, room, subject_id)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [instructor_id, class_time, slot, room, subject_id]
  );
  res.json(result.rows[0]);
});

// UPDATE class
app.put("/classes/:id", async (req, res) => {
  const { id } = req.params;
  const { instructor_id, class_time, slot, room, subject_id } = req.body;
  const result = await pool.query(
    `UPDATE tbl_course_classes SET
      instructor_id=$1, class_time=$2, slot=$3, room=$4, subject_id=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [instructor_id, class_time, slot, room, subject_id, id]
  );
  res.json(result.rows[0]);
});

// DELETE class
app.delete("/classes/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tbl_course_classes WHERE id=$1", [id]);
  res.json({ message: "Class deleted successfully." });
});


// ito ay table ng tbl_view_available_course

// GET all available courses
app.get("/available-courses", async (req, res) => {
  const result = await pool.query("SELECT * FROM tbl_view_available_course");
  res.json(result.rows);
});

// GET available course by id
app.get("/available-courses/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM tbl_view_available_course WHERE id=$1", [id]);
  res.json(result.rows[0]);
});

// CREATE available course
app.post("/available-courses", async (req, res) => {
  const { class_id, subject_id, semester_id, school_year } = req.body;
  const result = await pool.query(
    `INSERT INTO tbl_view_available_course (class_id, subject_id, semester_id, school_year)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [class_id, subject_id, semester_id, school_year]
  );
  res.json(result.rows[0]);
});

// UPDATE available course
app.put("/available-courses/:id", async (req, res) => {
  const { id } = req.params;
  const { class_id, subject_id, semester_id, school_year } = req.body;
  const result = await pool.query(
    `UPDATE tbl_view_available_course SET
      class_id=$1, subject_id=$2, semester_id=$3, school_year=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [class_id, subject_id, semester_id, school_year, id]
  );
  res.json(result.rows[0]);
});

// DELETE available course
app.delete("/available-courses/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tbl_view_available_course WHERE id=$1", [id]);
  res.json({ message: "Available course deleted successfully." });
});


// ito ay i istart ng server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
