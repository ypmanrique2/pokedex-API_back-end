import { Router } from 'express';

import crypto from 'crypto';

import pool from '../db/mysql.js';
import { isAdmin } from '../middleware/admin.guard.js';

const router = Router();

// READ - Listar usuarios (admin)
router.get('/', isAdmin, async (_req, res) => {
    const [rows] = await pool.query(
        'SELECT id, usuario, nombre, rol FROM usuarios'
    );
    res.json(rows);
});

// UPDATE - Editar usuario
router.put('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { usuario, clave, rol, nombre } = req.body;

    let query = 'UPDATE usuarios SET ';
    const params = [];

    if (usuario) { query += 'usuario=?, '; params.push(usuario); }
    if (clave) {
        query += 'clave=?, ';
        params.push(crypto.createHash('md5').update(clave).digest('hex'));
    }
    if (rol) { query += 'rol=?, '; params.push(rol); }
    if (nombre) { query += 'nombre=?, '; params.push(nombre); }

    query = query.slice(0, -2) + ' WHERE id=?';
    params.push(id);

    await pool.query(query, params);
    res.json({ message: 'Usuario actualizado' });
});

// DELETE - Eliminar usuario
router.delete('/:id', isAdmin, async (req, res) => {
    await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
    res.json({ message: 'Usuario eliminado' });
});

export default router;