import express from 'express'
import { RegisterController } from '../controllers/register.controller';

const RegisterRouter = express.Router();

RegisterRouter.route('/').post(
    (req, res) => new RegisterController().register(req, res)
)

export default RegisterRouter;