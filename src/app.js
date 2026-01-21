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
    origin: process.env.FRONTEND_URL,
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
        sameSite: 'none', // necesario para Front-end desplegado
        secure: process.env.NODE_ENV === 'production'
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