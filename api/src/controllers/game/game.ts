import { ERRORS } from '../../config/constants';
import { logger } from '../../util/logger';
import { ExpressRequest } from '../../util/express';
import * as gameHelpers from '../../helpers/game';
import { Response } from 'express';
import Joi from 'joi';

export async function createGame(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  try {
    const { guestUsername } = req.body;
    const schema = Joi.object().keys({
      guestUsername: Joi.string().required(),
    });
    const validation = Joi.validate(req.body, schema);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        error: validation.error.details[0].message,
      });
    }

    const user = req.user;
    const { success, game, error, code } = await gameHelpers.createGame({
      host: {
        id: user.id,
        username: user.username,
      },
      guestUsername,
    });

    return res.status(code).json({ success, error, data: { game } });

    // send data via socket at this point
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export async function getAllGames(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;

    const { success, games, error, code } = await gameHelpers.getAllGames({
      userId: user.id,
    });

    return res.status(code).json({ success, error, data: { games } });

    // send data via socket at this point
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export async function acceptGameInvitation(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;

    const { id } = req.params;

    const { success, game, error, code } = await gameHelpers.acceptInvitation({
      userId: user.id,
      gameId: Number(id),
    });

    return res.status(code).json({ success, error, data: { game } });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export async function updateChosenWord(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;
    const { id } = req.params;
    const { word } = req.body;

    const schema = Joi.object().keys({
      word: Joi.string().required(),
      id: Joi.number().required(),
    });
    const validation = Joi.validate({ ...req.body, ...req.params }, schema);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        error: validation.error.details[0].message,
      });
    }

    const { success, game, error, code } = await gameHelpers.updateChosenWord({
      word,
      gameId: Number(id),
    });

    return res.status(code).json({ success, error, data: { game } });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export async function respondToGame(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;

    const { id } = req.params;
    const { response } = req.body;

    const schema = Joi.object().keys({
      response: Joi.string().required(),
      id: Joi.number().required(),
    });
    const validation = Joi.validate({ ...req.body, ...req.params }, schema);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        error: validation.error.details[0].message,
      });
    }

    const {
      success,
      gameResponse,
      error,
      code,
    } = await gameHelpers.respondToGame({
      response,
      userId: user.id,
      gameId: Number(id),
    });

    return res.status(code).json({ success, error, data: { gameResponse } });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export async function guessWord(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  try {
    const user = req.user;

    const { id } = req.params;
    const { word } = req.body;

    const schema = Joi.object().keys({
      word: Joi.string().required(),
      id: Joi.number().required(),
    });
    const validation = Joi.validate({ ...req.body, ...req.params }, schema);
    if (validation.error) {
      return res.status(400).json({
        success: false,
        error: validation.error.details[0].message,
      });
    }

    const { success, game, error, code } = await gameHelpers.guessWord({
      word,
      userId: user.id,
      gameId: Number(id),
    });

    return res.status(code).json({ success, error, data: { game } });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}
