import express from 'express'
import RequestModel from '../models/request.model'
import { CONSOLE_INFO } from '../util/console.util'
import UserModel from '../models/user.model'

export class AdminController {
    get_requests = async (req: express.Request, res: express.Response) => {
        const all_requests = await RequestModel.find()
        CONSOLE_INFO(`Rertrieving all new user requests...`)
        res.status(200).json({ requests: all_requests })
    }

    accept = async (req: express.Request, res: express.Response) => {
        const { uuid } = req.body;

        console.log(uuid)
        try {
            const request = await RequestModel.findOneAndDelete({
                UUID: uuid
            });

            await UserModel.create({
                username: request?.username,
                password: request?.password,
                org: request?.org
            });
            CONSOLE_INFO(`New user account ${request?.username} ACCEPTED.`)
            res.status(200).json({ pass: true })
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: error })
        }
    }

    decline = async (req: express.Request, res: express.Response) => {
        const { uuid } = req.body;
        try {
            const request = await RequestModel.findOneAndDelete({
                UUID: uuid
            });

            CONSOLE_INFO(`New user account ${request?.username} DENIED.`)
            res.status(200).json({ pass: false })
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: error })
        }
    }
}