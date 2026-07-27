const pool = require('./src/config/database');
const bcrypt = require('bcrypt');

async function crearAdmin() {
    try {
        const email = 'admin@nomina.com';
        const passwordPlana = '123456';
        const hashedPassword = await bcrypt.hash(passwordPlana, 10);

        await pool.query('DELETE FROM usuarios WHERE email = $1', [email]);

        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4)',
            ['Administrador', email, hashedPassword, 'admin']
        );

        console.log('✅ ¡Administrador creado correctamente con hash automático!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

crearAdmin();