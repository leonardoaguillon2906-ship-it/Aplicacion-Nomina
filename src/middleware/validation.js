// src/middleware/validation.js
const validate = (schema) => {
  return (req, res, next) => {
    // Si usas express-validator o joi, aquí iría la lógica. 
    // Por ahora, permitimos que pase la petición:
    next();
  };
};

module.exports = {
  validate
};