// Middleware simple de sesión
export const requireAuth = (req, res, next) => {
    if (!req.session?.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    next();
};
