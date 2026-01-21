// Middleware para proteger rutas de administrador
export function isAdmin(req, res, next) {
    if (!req.session || req.session.rol !== 'ADMINISTRADOR') {
        return res.status(403).json({ error: 'No autorizado' });
    }
    next();
}