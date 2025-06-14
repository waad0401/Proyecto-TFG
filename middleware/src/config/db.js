// Carga variables de entorno desde .env
require('dotenv').config();

const mysql = require('mysql2/promise');

// Lee la configuración de conexión de .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,    
  port: process.env.DB_PORT,           
  user: process.env.DB_USER,         
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,    
  waitForConnections: true,                    
  connectionLimit: 10,                         
  queueLimit: 0                                
});

module.exports = {
  /**
   * Ejecuta una consulta SQL.
   * @param {string} sql 
   * @param {Array<any>} params 
   */
  query: (sql, params) => pool.query(sql, params),

  /**
   * Obtiene una conexión para transacciones.
   */
  getConnection: () => pool.getConnection()
};
