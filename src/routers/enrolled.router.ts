import express from 'express'
import { EnrollController } from '../controllers/enrolled.controller';
const EnrolledRouter = express.Router();

EnrolledRouter.route('/add').post(
    (req, res) => new EnrollController().enroll(req, res)
);

export default EnrolledRouter;