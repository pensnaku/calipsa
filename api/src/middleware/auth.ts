import { NextFunction, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { ERRORS } from '../config/constants';
import * as env from '../config/env';
import { getUserByUsername } from '../helpers/user';
import { ExpressRequest } from '../util/express';
import { logger } from '../util/logger';

export async function validateUserToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> {
  let { authorization } = req.headers;

  const schema = Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .label('authorization [header]')
        .options({
          language: {
            string: { regex: { base: 'must be a valid bearer token' } },
          },
        }),
    })
    .unknown(true);
  const validation = Joi.validate(req.headers, schema);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  try {
    if (!authorization) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header is missing in your request',
      });
    }

    const [, token] = authorization.split('Bearer ');
    let decoded: { username: string };

    try {
      decoded = jwt.verify(token, env.TOKEN_SECRET) as { username: string };
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: ERRORS.INVALID_AUTH,
      });
    }

    const { success, code, user, error } = await getUserByUsername({
      username: decoded.username,
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: ERRORS.INVALID_AUTH });
    }

    req.user = user;
    return next();
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export function generateBearerToken({
  username,
}: {
  username: string;
}): string {
  return jwt.sign({ username }, env.TOKEN_SECRET, {
    expiresIn: '1d',
  });
}
