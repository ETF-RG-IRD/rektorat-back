import express from 'express'
import RequestModel from '../models/request.model'
import { CONSOLE_INFO } from '../util/console.util'

export class AdminController {
    get_requests = async (req: express.Request, res: express.Response) => {
        const all_requests = await RequestModel.find()
        CONSOLE_INFO(`Rertrieving all new user requests...`)
        res.status(200).json({requests: all_requests})
    }
}