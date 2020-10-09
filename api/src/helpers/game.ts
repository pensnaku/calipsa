import { ERRORS, GAME_STATUSES } from '../config/constants';
import { getUserByUsername } from './user';
import { Op } from 'sequelize';
import { logger } from '../util/logger';
import { emitData } from '../util/socket';
const Game = require('../database/models').Game;
const User = require('../database/models').User;
const GameResponse = require('../database/models').GameResponse;
import { EVENTS } from '../config/constants';

export async function createGame({
  host,
  guestUsername,
}: {
  host: {
    username: string;
    id: string;
  };
  guestUsername: string;
}): Promise<{
  success: boolean;
  game?: any;
  error?: string;
  code: number;
}> {
  try {
    const { success, error, user, code } = await getUserByUsername({
      username: guestUsername,
    });
    if (!success) {
      return {
        success,
        code,
        error: `No user with username: ${guestUsername}`,
      };
    }
    const game = new Game({
      hostId: host.id,
      guestId: user.id,
    });
    await game.save();

    const gameToReturn = {
      ...game.toJSON(),
      host: {
        id: host.id,
        username: host.username,
      },
      guest: {
        id: user.id,
        username: guestUsername,
      },
      responses: [],
    };

    emitData(`${EVENTS.NEW_REQUEST}_${user.id}`, gameToReturn);
    return {
      success: true,
      code: 200,
      game: gameToReturn,
    };
  } catch (error) {
    console.log(error);
    return {
      code: 500,
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function getAllGames({
  userId,
}: {
  userId: number;
}): Promise<{
  success: boolean;
  games?: any;
  error?: string;
  code: number;
}> {
  try {
    const allUserGames = await Game.findAll({
      where: { [Op.or]: [{ hostId: userId }, { guestId: userId }] },
      include: [
        { model: User, as: 'host', attributes: ['username', 'id'] },
        { model: User, as: 'guest', attributes: ['username', 'id'] },
        { model: GameResponse, as: 'responses' },
      ],
    });

    return {
      code: 200,
      success: true,
      games: allUserGames,
    };
  } catch (error) {
    logger.error(error);
    return {
      code: 500,
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function acceptInvitation({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}): Promise<{
  success: boolean;
  game?: any;
  error?: string;
  code: number;
}> {
  try {
    const game = await Game.findOne({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      return {
        code: 404,
        success: false,
        error: 'Game not found',
      };
    }

    game.status = GAME_STATUSES.ONGOING;
    await game.save();

    emitData(`${EVENTS.GAME_ACCEPTED}_${game.id}`, { id: game.id });

    return {
      code: 200,
      success: true,
      game,
    };
  } catch (error) {
    logger.error(error);
    return {
      code: 500,
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function updateChosenWord({
  gameId,
  word,
}: {
  gameId: number;
  word: string;
}): Promise<{
  success: boolean;
  game?: any;
  error?: string;
  code: number;
}> {
  try {
    const game = await Game.findOne({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      return {
        code: 404,
        success: false,
        error: 'Game not found',
      };
    }

    game.chosenWord = word;
    await game.save();

    emitData(`${EVENTS.WORD_UPDATE}_${game.id}`, { gameId: game.id, word });

    return {
      code: 200,
      success: true,
      game,
    };
  } catch (error) {
    console.log(error);
    logger.error(error);
    return {
      code: 500,
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function respondToGame({
  gameId,
  response,
  userId,
}: {
  gameId: number;
  userId: number;
  response: string;
}): Promise<{
  success: boolean;
  gameResponse?: any;
  error?: string;
  code: number;
}> {
  try {
    const game = await Game.findOne({ where: { id: gameId } });

    if (!game) {
      return {
        success: false,
        code: 404,
        error: 'Game not found',
      };
    }

    if (!game.chosenWord) {
      return {
        success: false,
        code: 400,
        error:
          'A word has to be chosen before you can ask a question or respond',
      };
    }

    const lastGameResponse = await GameResponse.findOne({
      where: {
        gameID: gameId,
      },
      order: [['createdAt', 'DESC']],
    });

    if (
      (!lastGameResponse && userId === game.hostId) ||
      (lastGameResponse && lastGameResponse.userID === userId)
    ) {
      return {
        success: false,
        code: 400,
        error:
          'Please wait for a response or question from the other participant',
      };
    }

    const gameResponse = new GameResponse({
      userID: userId,
      gameID: gameId,
      response,
    });

    await gameResponse.save();
    emitData(`${EVENTS.NEW_RESPONSE}_${game.id}`, {
      ...gameResponse.toJSON(),
    });

    return {
      success: true,
      code: 200,
      gameResponse,
    };
  } catch (error) {
    logger.error(error.stack);
    return {
      code: 500,
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function guessWord({
  gameId,
  word,
  userId,
}: {
  gameId: number;
  userId: number;
  word: string;
}): Promise<{
  success: boolean;
  game?: any;
  error?: string;
  code: number;
}> {
  try {
    const game = await Game.findOne({ where: { id: gameId } });

    if (!game) {
      return {
        success: false,
        code: 404,
        error: 'Game not found',
      };
    }

    if (userId !== game.guestId) {
      return {
        success: false,
        error: 'Only the guest can guess the word',
        code: 400,
      };
    }

    if (!game.chosenWord) {
      return {
        success: false,
        error: 'The game host has not picked a word yet',
        code: 400,
      };
    }

    if (word.toLowerCase() === game.chosenWord.toLowerCase()) {
      game.winnerId = userId;
    } else {
      game.winnerId = game.hostId;
    }

    game.status = GAME_STATUSES.ENDED;
    await game.save();

    emitData(`${EVENTS.GAME_ENDED}_${game.id}`, {
      winnerId: game.winnerId,
      gameId: game.id,
    });

    return {
      success: true,
      code: 200,
      game,
    };
  } catch (error) {
    logger.error(error.stack);
    return {
      code: 500,
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
    };
  }
}
