export const errorHandler = (err, req, res, _next) => {
    console.error('GLOBAL ERROR:', err);

    res.status(500).json({
        ok: false,
        message: 'Error inesperado del servidor'
    });
};