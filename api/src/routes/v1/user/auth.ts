import express from 'express';
import * as userAuthController from '../../../controllers/user/auth';

const router = express.Router();

router.post('/login', userAuthController.loginHandler);

router.post('/register', userAuthController.registerationHandler);

export default router;
