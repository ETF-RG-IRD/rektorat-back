import express from 'express'
import bcrypt from 'bcrypt'
import UserModel from '../models/user.model';
import RequestModel from '../models/request.model';
import { CONSOLE_INFO } from '../util/console.util';
import {v4 as uuidv4} from 'uuid';



export class RegisterController {
    /**
     * 
     * @param req HTML request with headers and body
     * @param res HTML response sent back to the user with status code
     * @description
     * Registers the user so that the admin and user roles are seperated.
     * The idea is to have one admin and multiple users because the people that stand on the door are interchangable.
     * */
    register = async (req: express.Request, res: express.Response) => {
        const { username, password, org } = req.body;

        CONSOLE_INFO(`${username}, ${password}, ${org}`)

        // To avoid conflicts and secure to secure the usernames
        const hashed_user = await bcrypt.hash(username + org, 10);
        const hashed_password = await bcrypt.hash(password, 10);

        try {
            const existing_user = await UserModel.exists({
                username: hashed_user,
                org: org
            }).exec();
            
            const existing_request = await RequestModel.exists({
                username: username,
                password: hashed_password,
                org: org
            }).exec();

            if (!existing_user && !existing_request) {
                await RequestModel.create({
                    username: username,
                    password: hashed_password,
                    org: org,
                    UUID: uuidv4()
                });
                CONSOLE_INFO(`Register : New request for user account for approval by ${hashed_user}`);
                res.status(200).json({ pass: true })
            } else {
                CONSOLE_INFO(`Register: User tried registering already existing account with username ${hashed_user} or request already exists`);
                res.status(200).json({ pass: false })
            }
        }
        catch (error) {
            console.error("Error enrolling student:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}