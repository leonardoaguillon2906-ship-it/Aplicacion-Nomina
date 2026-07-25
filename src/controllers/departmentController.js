const Department = require('../models/Department');

exports.getAllDepartments = async (req, res, next) => {
    try {
        const departamentos = await Department.getAll();
        
        // Si la petición viene desde el navegador esperando HTML/EJS
        if (req.accepts('html')) {
            return res.render('departamentos', { departamentos });
        }
        
        // Si es una petición API JSON tradicional
        res.json({ success: true, data: departamentos });
    } catch (error) {
        next(error); // Utiliza tu middleware errorHandler global
    }
};