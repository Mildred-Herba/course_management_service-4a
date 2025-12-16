import express from "express";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_ZxsQ4IA3SfqW@ep-square-water-adoe2auv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false },
});

// -------------------- COURSES --------------------

// GET all courses
app.get("/courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tbl_course_courses");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET course by id
app.get("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM tbl_course_courses WHERE course_id=$1", [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Course not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE course
app.post("/courses", async (req, res) => {
  try {
    const { course_name } = req.body;
    if (!course_name) return res.status(400).json({ error: "course_name is required" });
    const result = await pool.query(
      "INSERT INTO tbl_course_courses (course_name) VALUES ($1) RETURNING *",
      [course_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE course
app.put("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { course_name } = req.body;

    // Optional: Log incoming data for debugging
    console.log("Received PUT:", { id, course_name });

    // Run the UPDATE
    const result = await pool.query(
      "UPDATE tbl_course_courses SET course_name = $1, updated_at = NOW() WHERE course_id = $2 RETURNING *",
      [course_name, id]
    );

    // If no row was found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Success
    res.json(result.rows[0]);

  } catch (err) {
    // Log DB errors too
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// DELETE course
app.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tbl_course_courses WHERE course_id=$1 RETURNING *", [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- SUBJECTS --------------------

// GET all subjects
app.get("/subjects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tbl_course_subject");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET subject by id
app.get("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM tbl_course_subject WHERE id=$1", [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Subject not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE subject
app.post("/subjects", async (req, res) => {
  try {
    const { subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id } = req.body;
    if (!subject_id || !course_name || !units || !course_id) return res.status(400).json({ error: "Missing required fields" });
    const result = await pool.query(
      `INSERT INTO tbl_course_subject
        (subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE subject
app.put("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id } = req.body;
    const result = await pool.query(
      `UPDATE tbl_course_subject SET
        subject_id=$1, course_name=$2, units=$3, class_time=$4, class_id=$5, instructor_id=$6, pre_requisite=$7, course_id=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [subject_id, course_name, units, class_time, class_id, instructor_id, pre_requisite, course_id, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Subject not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE subject
app.delete("/subjects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tbl_course_subject WHERE id=$1 RETURNING *", [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- CLASSES --------------------

// GET all classes
app.get("/classes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tbl_course_classes");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE class
app.post("/classes", async (req, res) => {
  try {
    const { instructor_id, class_time, slot, room, subject_id } = req.body;
    if (!instructor_id || !subject_id) return res.status(400).json({ error: "instructor_id and subject_id are required" });
    const result = await pool.query(
      `INSERT INTO tbl_course_classes (instructor_id, class_time, slot, room, subject_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [instructor_id, class_time, slot, room, subject_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE class
app.put("/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { instructor_id, class_time, slot, room, subject_id } = req.body;
    const result = await pool.query(
      `UPDATE tbl_course_classes SET
        instructor_id=$1, class_time=$2, slot=$3, room=$4, subject_id=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [instructor_id, class_time, slot, room, subject_id, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Class not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE class
app.delete("/classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tbl_course_classes WHERE id=$1 RETURNING *", [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Class not found" });
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- AVAILABLE COURSES --------------------

// GET all available courses
app.get("/available-courses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tbl_view_available_course");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE available course
app.post("/available-courses", async (req, res) => {
  try {
    const { class_id, subject_id, semester_id, school_year } = req.body;
    if (!class_id || !subject_id || !semester_id || !school_year) return res.status(400).json({ error: "Missing required fields" });
    const result = await pool.query(
      `INSERT INTO tbl_view_available_course (class_id, subject_id, semester_id, school_year)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [class_id, subject_id, semester_id, school_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE available course
app.put("/available-courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, subject_id, semester_id, school_year } = req.body;
    const result = await pool.query(
      `UPDATE tbl_view_available_course SET
        class_id=$1, subject_id=$2, semester_id=$3, school_year=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [class_id, subject_id, semester_id, school_year, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Available course not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE available course
app.delete("/available-courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tbl_view_available_course WHERE id=$1 RETURNING *", [id]);
    if (!result.rows[0]) return res.status(404).json({ error: "Available course not found" });
    res.json({ message: "Available course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
