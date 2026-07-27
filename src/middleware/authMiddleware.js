const verificarSesion = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // El usuario está autenticado, puede continuar
    }
    res.redirect('/login'); // Si no está logueado, lo manda al login
};

exports.verificarSesion = verificarSesion;