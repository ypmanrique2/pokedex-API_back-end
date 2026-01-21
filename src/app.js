import 'dotenv/config';

import express from 'express';

import cors from 'cors';

import session from 'express-session';

import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://pokedexaplication.netlify.app',
    credentials: true
}));

app.use(express.json());

app.use(session({
    name: 'pokedex.sid',
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,        // OBLIGATORIO en Back-end desplegado (HTTPS)
        sameSite: 'none',    // OBLIGATORIO Front-end desplegado y Back-end desplegado
        maxAge: 1000 * 60 * 60
    }
}));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usersRoutes);

app.get('/', (_req, res) => res.send('API Pokedex OK'));
app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Backend corriendo en puerto ${PORT}`);
});