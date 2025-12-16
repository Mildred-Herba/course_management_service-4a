require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL="postgresql://neondb_owner:npg_ZxsQ4IA3SfqW@ep-square-water-adoe2auv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false } // required for Neon
});

module.exports = pool;
