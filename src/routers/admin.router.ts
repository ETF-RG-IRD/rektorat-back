import express from 'express'
import { AdminController } from '../controllers/admin.controller';
const AdminRouter = express.Router();

AdminRouter.route('/').get(
    (req, res) => new AdminController().get_requests(req, res)
);
AdminRouter.route('/approve').post(
    (req, res) => new AdminController().accept(req, res)
);
AdminRouter.route('/decline').post(
    (req, res) => new AdminController().decline(req, res)
);

export default AdminRouter;