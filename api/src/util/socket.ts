import socketIO from 'socket.io';
import io from '../server';
import { logger } from './logger';

export function emitData(channel: string, data: any) {
  io.emit(channel, data);
  logger.info(`${channel} data emitted`);
}
