// src/models/Department.js
const pool = require('../config/database');

class Department {
    static async getAll() {
        const result = await pool.query('SELECT id, nombre, presupuesto FROM departamentos');
        return result.rows;
    }
}

module.exports = Department;