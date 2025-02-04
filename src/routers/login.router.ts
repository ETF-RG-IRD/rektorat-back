import express from 'express'
import { LoginController } from '../controllers/login.controller';
const LoginRouter = express.Router();

LoginRouter.route('/').post(
    (req, res) => new LoginController().login(req, res)
);

export default LoginRouter;