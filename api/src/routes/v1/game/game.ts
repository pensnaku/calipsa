import express from 'express';
import * as gameController from '../../../controllers/game/game';

const router = express.Router();

router.post('/', gameController.createGame);

router.get('/', gameController.getAllGames);

router.patch('/:id/accept', gameController.acceptGameInvitation);

router.patch('/:id/word', gameController.updateChosenWord);

router.post('/:id/respond', gameController.respondToGame);

router.post('/:id/guess', gameController.guessWord);

export default router;
