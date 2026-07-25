// src/models/Employee.js
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Employee {
  // Crear empleado
  static async create(employeeData) {
    const {
      nombre,
      apellido,
      email,
      rfc,
      curp,
      puesto,
      departamento,
      fecha_ingreso,
      salario,
      tipo_contrato,
      activo = true
    } = employeeData;

    const query = `
      INSERT INTO employees 
      (nombre, apellido, email, rfc, curp, puesto, departamento, 
       fecha_ingreso, salario, tipo_contrato, activo, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *
    `;

    const values = [
      nombre, apellido, email, rfc, curp, puesto, departamento,
      fecha_ingreso, salario, tipo_contrato, activo
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al crear empleado: ${error.message}`);
    }
  }

  // Obtener empleado por ID
  static async findById(id) {
    const query = 'SELECT * FROM employees WHERE id = $1 AND activo = true';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error al obtener empleado: ${error.message}`);
    }
  }

  // Obtener todos los empleados
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM employees WHERE activo = true';
    const values = [];
    let paramCount = 1;

    if (filters.departamento) {
      query += ` AND departamento = $${paramCount++}`;
      values.push(filters.departamento);
    }

    if (filters.puesto) {
      query += ` AND puesto = $${paramCount++}`;
      values.push(filters.puesto);
    }

    if (filters.search) {
      query += ` AND (nombre ILIKE $${paramCount++} OR apellido ILIKE $${paramCount++})`;
      values.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY apellido, nombre';

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al listar empleados: ${error.message}`);
    }
  }

  // Actualizar empleado
  static async update(id, employeeData) {
    const allowedFields = [
      'nombre', 'apellido', 'email', 'puesto', 'departamento',
      'salario', 'tipo_contrato'
    ];

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(employeeData).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount++}`);
        values.push(employeeData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No hay campos validos para actualizar');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE employees 
      SET ${fields.join(', ')} 
      WHERE id = $${paramCount} AND activo = true
      RETURNING *
    `;

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error al actualizar empleado: ${error.message}`);
    }
  }

  // Desactivar empleado (soft delete)
  static async deactivate(id) {
    const query = `
      UPDATE employees 
      SET activo = false, updated_at = NOW() 
      WHERE id = $1
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error al desactivar empleado: ${error.message}`);
    }
  }

  // Validar datos antes de guardar
  static validate(employeeData) {
    const errors = {};

    if (!employeeData.nombre || employeeData.nombre.trim().length === 0) {
      errors.nombre = 'El nombre es requerido';
    }

    if (!employeeData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) {
      errors.email = 'Email invalido';
    }

    if (!employeeData.rfc || employeeData.rfc.length !== 13) {
      errors.rfc = 'RFC invalido';
    }

    if (employeeData.salario && employeeData.salario < 0) {
      errors.salario = 'El salario no puede ser negativo';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }
}

module.exports = Employee;
