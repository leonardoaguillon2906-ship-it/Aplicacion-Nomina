// src/models/Department.js
const pool = require('../config/database');

class Department {
    static async getAll() {
        const result = await pool.query('SELECT * FROM departamentos');
        return result.rows;
    }
}

module.exports = Department;