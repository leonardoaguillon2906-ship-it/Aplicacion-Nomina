// src/controllers/employeeController.js
const Employee = require('../models/Employee');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

class EmployeeController {
  // Crear empleado
  static async create(req, res, next) {
    try {
      const errors = Employee.validate(req.body);
      
      if (errors) {
        return res.status(400).json({
          success: false,
          message: 'Error de validacion',
          errors
        });
      }

      const employee = await Employee.create(req.body);
      
      logger.info('Empleado creado', { 
        employeeId: employee.id,
        email: employee.email 
      });

      res.status(201).json({
        success: true,
        message: 'Empleado creado exitosamente',
        data: employee
      });
    } catch (error) {
      logger.error('Error al crear empleado', { error: error.message });
      next(new AppError(error.message, 400));
    }
  }

  // Obtener todos los empleados
  static async getAll(req, res, next) {
    try {
      const filters = {
        departamento: req.query.departamento,
        puesto: req.query.puesto,
        search: req.query.search
      };

      const employees = await Employee.findAll(filters);

      res.json({
        success: true,
        count: employees.length,
        data: employees
      });
    } catch (error) {
      logger.error('Error al listar empleados', { error: error.message });
      next(new AppError(error.message, 500));
    }
  }

  // Obtener empleado por ID
  static async getById(req, res, next) {
    try {
      const employee = await Employee.findById(req.params.id);

      if (!employee) {
        return next(new AppError('Empleado no encontrado', 404));
      }

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      logger.error('Error al obtener empleado', { error: error.message });
      next(new AppError(error.message, 500));
    }
  }

  // Actualizar empleado
  static async update(req, res, next) {
    try {
      const employee = await Employee.update(req.params.id, req.body);

      if (!employee) {
        return next(new AppError('Empleado no encontrado', 404));
      }

      logger.info('Empleado actualizado', { employeeId: employee.id });

      res.json({
        success: true,
        message: 'Empleado actualizado exitosamente',
        data: employee
      });
    } catch (error) {
      logger.error('Error al actualizar empleado', { error: error.message });
      next(new AppError(error.message, 400));
    }
  }

  // Eliminar empleado (soft delete)
  static async delete(req, res, next) {
    try {
      const employee = await Employee.deactivate(req.params.id);

      if (!employee) {
        return next(new AppError('Empleado no encontrado', 404));
      }

      logger.info('Empleado desactivado', { employeeId: employee.id });

      res.json({
        success: true,
        message: 'Empleado desactivado exitosamente'
      });
    } catch (error) {
      logger.error('Error al desactivar empleado', { error: error.message });
      next(new AppError(error.message, 500));
    }
  }

  // Obtener historial de nomina
  static async getPayrollHistory(req, res, next) {
    try {
      // Implementar logica de obtener historial
      res.json({
        success: true,
        message: 'Historial de nomina',
        data: []
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  // Subir documento
  static async uploadDocument(req, res, next) {
    try {
      // Implementar logica de carga de documentos
      res.json({
        success: true,
        message: 'Documento subido exitosamente'
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
  }

  // Login
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return next(new AppError('Email y contraseña requeridos', 400));
      }

      // Implementar logica de login
      res.json({
        success: true,
        message: 'Login exitoso',
        token: 'jwt_token_aqui'
      });
    } catch (error) {
      next(new AppError(error.message, 401));
    }
  }
}

module.exports = EmployeeController;
