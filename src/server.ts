import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors' // For cross-origin
import AdminModel from './models/admin.model'
import LoginRouter from './routers/login.router'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import EnrolledRouter from './routers/enrolled.router'
import RegisterRouter from './routers/register.router'
import AdminRouter from './routers/admin.router'

dotenv.config()


const app = express()



app.use(cors())
app.use(express.json()) // Announcing that we're sending data in JSON


mongoose.connect(process.env.CONNECTION_STRING as string)

const connection = mongoose.connection;
const router = express.Router();

connection.once('open', async () => {
    console.log('Connected to db! Checking for admin account');

    try {
        const existingAdmin = await AdminModel.findOne({ username: process.env.ADMIN_USERNAME });

        if (!existingAdmin) {
            const admin_data = {
                username: process.env.ADMIN_USERNAME as string,
                password: process.env.ADMIN_PASSWORD as string
            };


            const hashedPassword = await bcrypt.hash(admin_data.password, 10);
            admin_data.password = hashedPassword;

            await AdminModel.create(admin_data);
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists. No action needed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
})

app.use('/', router);
app.use('/login', LoginRouter);
app.use('/enroll', EnrolledRouter);
app.use('/register', RegisterRouter);
app.use('/admin', AdminRouter);

app.listen(4000, () => console.log('Express running on port 4000'))
