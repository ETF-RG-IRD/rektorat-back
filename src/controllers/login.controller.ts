import bcrypt from 'bcrypt'
import express from 'express'
import AdminModel from '../models/admin.model';
import UserModel from '../models/user.model';

export class LoginController {
    login = async (req: express.Request, res: express.Response) => {
        const { username, password } = req.body;

        try {
            const admin = await AdminModel.findOne({ username: username });
            const user = await UserModel.findOne({ username: username });

            let hashed_password = '';
            let password_match = false;
            if (admin) {
                hashed_password = admin.password;
                password_match = await bcrypt.compare(password, hashed_password);

                if (password_match) {
                    res.status(200).json({ message: 'OK', admin: true });
                } else {
                    res.status(401).json({ message: 'INVALID PASSWORD' });
                }
            } else if (user) {
                hashed_password = user.password;
                password_match = await bcrypt.compare(password, hashed_password)

                if (password_match) {
                    res.status(200).json({ message: 'OK', admin: false })
                }
                else {
                    res.status(401).json({ message: 'INVALID PASSWORD' })
                }
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}