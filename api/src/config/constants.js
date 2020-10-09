"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = {
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    INVALID_AUTH: 'Invalid Authentication Token',
    LOGIN_FAILED: 'Login failed. Please check your credentials',
    LOGIN_SUCCESSFUL: 'Login was successful',
    PASSWORD_NOT_SET: 'You probably have not completed the registration process',
};
exports.GAME_STATUSES = {
    PENDING: 'pending',
    ONGOING: 'ongoing',
    ENDED: 'ended',
};
exports.MAX_QUESTIONS = 20;
exports.EVENTS = {
    NEW_REQUEST: 'NEW_REQUEST',
    NEW_RESPONSE: 'NEW_RESPONSE',
    WORD_UPDATE: 'WORD_UPDATE',
    GAME_ACCEPTED: 'GAME_ACCEPTED',
    GAME_ENDED: 'GAME_ENDED',
};
