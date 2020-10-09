import { ExpressRequest } from '../../util/express';
import { Response } from 'express';
import * as userHelpers from '../../helpers/user';
import * as authMiddleware from '../../middleware/auth';
import Joi from 'joi';
import { logger } from '../../util/logger';
import { ERRORS } from '../../config/constants';

export async function loginHandler(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  const { username, password } = req.body;

  const schema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  try {
    const {
      success,
      user,
      error,
      code,
    } = await userHelpers.validateUserPassword({
      username,
      password,
    });

    if (!success) {
      return res.status(code).json({
        success,
        error,
      });
    }

    const token = authMiddleware.generateBearerToken({
      username: user.username,
    });

    return res.json({
      success,
      message: 'Login Successful',
      data: { user, token },
    });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export async function registerationHandler(
  req: ExpressRequest,
  res: Response,
): Promise<Response> {
  const { username, password, confirmPassword } = req.body;

  const schema = Joi.object()
    .keys({
      username: Joi.string().min(5).required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .options({ language: { any: { allowOnly: 'must match password' } } }),
    })
    .with('password', ['confirmPassword']);
  const validation = Joi.validate(req.body, schema);
  if (validation.error) {
    return res.status(400).json({
      success: false,
      error: validation.error.details[0].message,
    });
  }

  try {
    const { success, user, error, code } = await userHelpers.registerUser({
      username,
      password,
    });

    if (!success) {
      return res.status(code).json({
        success,
        error,
      });
    }

    const token = authMiddleware.generateBearerToken({
      username: user.username,
    });

    return res.json({
      success,
      message: 'Registration Successful',
      data: { user, token },
    });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(500)
      .json({ success: false, error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}
