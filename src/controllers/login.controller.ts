import bcrypt from 'bcrypt'
import express from 'express'
import AdminModel from '../models/admin.model';

export class LoginController {
    login = async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;

        try {
            const admin = await AdminModel.findOne({ username: username });

            if (admin) {
                const hashed_password = admin.password;
                const password_match = await bcrypt.compare(password, hashed_password);

                if (password_match) {
                    res.status(200).json({ message: 'OK'});
                } else {
                    res.status(401).json({ message: 'INVALID PASSWORD' });
                }
            } else {
                res.status(404).json({ message: 'Admin not found' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}