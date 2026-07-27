const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Asegúrate de tener la ruta correcta a tu configuración de base de datos
const bcrypt = require('bcrypt');

// 1. Mostrar vista de login (si aplica)
router.get('/login', (req, res) => {
    res.render('login');
});

// 2. Procesar el inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (resultado.rows.length === 0) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }

        const usuario = resultado.rows[0];
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return res.render('login', { error: 'Correo o contraseña incorrectos' });
        }

        req.session.user = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: usuario.rol
        };

        res.redirect('/');
    } catch (error) {
        console.error('Error en el login:', error);
        res.render('login', { error: 'Ocurrió un error en el servidor' });
    }
});

// 3. Cerrar sesión (Logout)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;