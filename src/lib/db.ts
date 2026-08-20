import mysql from 'mysql2/promise';

// Create database connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u239297722_sawarn_db',
  password: process.env.DB_PASSWORD || 'Swarn@2026',
  database: process.env.DB_NAME || 'u239297722_sawarn_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

/**
 * Execute a MySQL query helper
 */
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
