import express from 'express'
import { AdminController } from '../controllers/admin.controller';
const AdminRouter = express.Router();

AdminRouter.route('/').get(
    (req, res) => new AdminController().get_requests(req, res)
);

export default AdminRouter;