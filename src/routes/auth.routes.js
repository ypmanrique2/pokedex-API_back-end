import { Router } from 'express';

import crypto from 'crypto';

import pool from '../db/mysql.js';

const router = Router();

// Login con hash MD5
router.post('/login', async (req, res) => {
    try {
        const { usuario, clave } = req.body;

        if (!usuario || !clave) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const hash = crypto.createHash('md5').update(clave).digest('hex');

        const [rows] = await pool.query(
            'SELECT id, usuario, rol, nombre, avatar FROM usuarios WHERE usuario=? AND clave=?',
            [usuario, hash]
        );

        if (!rows.length) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.usuario = rows[0].usuario;
        req.session.rol = rows[0].rol;

        res.json({ logueado: true, perfil: rows[0] });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Validación de sesión para refresh del frontend
router.get('/validar', (req, res) => {
    if (req.session?.usuario) {
        return res.json({ logueado: true, rol: req.session.rol });
    }
    res.json({ logueado: false });
});

// Logout destruyendo sesión
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Sesión cerrada' });
    });
});

export default router;