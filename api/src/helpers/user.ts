import { ERRORS } from '../config/constants';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import { logger } from '../util/logger';
const User = require('../database/models').User;

export async function validateUserPassword({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ success: boolean; user?: any; error?: string; code: number }> {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return {
      success: false,
      code: 401,
      error: 'Invalid username/password combination',
    };
  }

  if (!compareSync(password, user.password)) {
    return {
      success: false,
      code: 401,
      error: 'Invalid username/password combination',
    };
  }
  return {
    success: true,
    user,
    code: 200,
  };
}

export async function registerUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ success: boolean; user?: any; error?: string; code: number }> {
  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return {
        success: false,
        error: `Username: ${username} is not available`,
        code: 400,
      };
    }

    const user = new User({
      username,
      password: hashSync(password),
    });
    await user.save();
    return {
      success: true,
      code: 200,
      user,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
      code: 500,
    };
  }
}

export async function getUserByUsername({
  username,
}: {
  username: string;
}): Promise<{ success: boolean; user?: any; error?: string; code: number }> {
  try {
    const user = await User.findOne({ where: { username } });

    if (user) {
      return {
        success: true,
        user,
        code: 200,
      };
    }
    return {
      success: false,
      error: 'User not found',
      code: 404,
    };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: ERRORS.INTERNAL_SERVER_ERROR,
      code: 500,
    };
  }
}
