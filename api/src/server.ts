import { APP_PORT } from './config/env';
import { logger } from './util/logger';
const db: any = require('./database/models/index');
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import socketIO from 'socket.io';
import auth from './routes/v1/user/auth';
import game from './routes/v1/game/game';
import { validateUserToken } from './middleware/auth';

const app = express();

app.use(morgan('combined'));

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', async (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to WORD GAME API',
  });
});

app.use('/auth', auth);
app.use(validateUserToken);
app.use('/games', game);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const _server = app.listen(APP_PORT, () => {
  logger.info(`Word Game App started successfully on :${APP_PORT}`);
});

const io = socketIO(_server, { transports: ['websocket', 'polling'] });
io.on('connection', (socket) => {
  logger.info(`socket client connected successfully ${socket}`);
});

export default io;
