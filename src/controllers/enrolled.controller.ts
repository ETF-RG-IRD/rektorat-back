import express from 'express'
import RegisteredStudentModel from '../models/enrolled.model';
import StudentStreaksModel from '../models/streaks.model';
import { toZonedTime, format } from 'date-fns-tz';
import VerifiedStudentModel from '../models/verified.model';
import { v4 as uuidv4 } from 'uuid';
import { CONSOLE_FAIL, CONSOLE_INFO, CONSOLE_SUCCESS, CONSOLE_WARN } from '../util/console.util';
import ExitLogModel from '../models/log_exit.model';

export class EnrollController {
    /**
     * 
     * @param req This is just the HTML request header that has a body that contains the parameters sent over from the front-end\
     * as basically a JSON object.
     * @param res This a HTML response that gets sent back to the user. 
     * 
     * @description
     * This takes the todays date as a `Date` object and converts it to the local time.\
     * First we check for the student in the database and if it's his/hers first time being registered we create an entry.
     * Otherwise we just return the last date they were registered (that's the point of `{date: -1}` on line 36). And we'll use that to return to the user.
     */
    enroll = async (req: express.Request, res: express.Response) => {
        const { uid, org, today } = req.body;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);


        const time_zone = 'Europe/Belgrade';
        try {

            const zoned_today = toZonedTime(new Date(today), time_zone);

            const zoned_yesterday = toZonedTime(new Date(zoned_today), time_zone);
            zoned_yesterday.setDate(zoned_yesterday.getDate() - 1);

            // Check if the student is already registered
            const registered_student = await RegisteredStudentModel.findOne({
                uid: uid,
                org: org
            }).sort({ date: -1 }); // Get the most recent registration


            if (registered_student == null) {
                CONSOLE_INFO(`Enroll: Student ${uid} from ${org} first time being registered`)

                await VerifiedStudentModel.create({
                    uid: uid,
                    org: org
                });

                await RegisteredStudentModel.create({
                    uid: uid,
                    org: org,
                    date: zoned_today,
                    exit: uuidv4()
                });

                await StudentStreaksModel.create({
                    uid: uid,
                    org: org,
                    streak: 1,
                    largest_streak: 1
                });
                res.status(200).json({
                    new: true,
                    uid: uid,
                    org: org,
                    last_seen: format(zoned_today, 'dd-MM-yyyy HH:mm', { timeZone: time_zone })
                });
            }
            else {
                // Student has been registered before
                CONSOLE_SUCCESS(`Enroll: Found ${uid} from ${org}`)

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                // Check if the student was registered yesterday to update the streak

                const student_streak = await RegisteredStudentModel.findOne({
                    uid: uid,
                    org: org,
                    date: { $gte: toZonedTime(new Date(zoned_yesterday.setHours(0, 0, 0, 0)), time_zone), $lt: toZonedTime(new Date(zoned_yesterday.setHours(23, 59, 59, 999)), time_zone) }
                })

                if (student_streak != null) {
                    await StudentStreaksModel.findOneAndUpdate(
                        {
                            uid: uid,
                            org: org
                        },
                        [
                            {
                                $set: {
                                    streak: { $add: ["$streak", 1] }, // Increment the streak by 1
                                    largest_streak: {
                                        $cond: {
                                            if: { $gt: [{ $add: ["$streak", 1] }, "$largest_streak"] }, // Check if the new streak is the largest
                                            then: { $add: ["$streak", 1] }, // Update the largest streak
                                            else: "$largest_streak" // Keep the existing largest streak
                                        }
                                    }
                                }
                            }
                        ],
                        { new: true } // Return the updated document
                    );
                    CONSOLE_INFO(`Enroll: Incremented student ${uid} from ${org} streak by 1.`)
                } else {
                    await StudentStreaksModel.findOneAndUpdate(
                        {
                            uid: uid,
                            org: org
                        },
                        [
                            {
                                $set: {
                                    streak: 1, // Reset the streak
                                }
                            }
                        ],
                        { new: true } // Return the updated document
                    );
                    CONSOLE_INFO(`Enroll: Reset student ${uid} from ${org} streak to 1.`)
                }


                // Register the student for today

                await RegisteredStudentModel.create({
                    uid: uid,
                    org: org,
                    date: zoned_today,
                    exit: uuidv4()
                });

                // Return response with last registration date and student details
                res.status(200).json({
                    new: false,
                    uid: uid,
                    org: org,
                    last_seen: format(registered_student.date!, 'dd-MM-yyyy HH:mm', { timeZone: time_zone })
                });
            }
            CONSOLE_SUCCESS(`Enroll: Student ${uid} from ${org} logged for today!`)
        } catch (error) {
            console.error("Error enrolling student:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


    /**
     * 
     * @param req HTML request
     * @param res HTML response
     * @description
     * 
     * */
    check = async (req: express.Request, res: express.Response) => {
        const { uid, org } = req.body;

        try {
            const verified = await VerifiedStudentModel.exists({
                uid: uid,
                org: org
            }).exec();

            if (verified) {
                CONSOLE_SUCCESS(`Stduent ${uid} from ${org} verified`)
                res.status(200).json({ message: `Pronađen student ${uid} sa fakulteta ${org}`, found: true });
            }
            else {
                CONSOLE_WARN(`Student ${uid} from ${org} not verified`)
                res.status(200).json({ message: `Nije verifikovan student ${uid} sa fakulteta ${org}`, found: false });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    log_exit = async (req: express.Request, res: express.Response) => {
        const { uid, org } = req.body;

        try {
            CONSOLE_INFO(`Logging exit of student ${uid} from ${org}.`)

            // Check if the student is already registered
            const registered_student = await RegisteredStudentModel.findOne({
                uid: uid,
                org: org
            }).sort({ date: -1 }); // Get the most recent registration

            if(registered_student == null) {
                CONSOLE_FAIL(`Student ${uid} from ${org} hasn't been logged at enterance!`)
                res.status(404).json({message: 'Student not found in entrance log', pass: false});
            }
            else {
                await ExitLogModel.create({
                    date_entry: registered_student.date,
                    date_exit: new Date(),
                    UUID: registered_student.exit
                })
                CONSOLE_SUCCESS(`Entry with uuid ${registered_student.exit} exited`);
                res.status(200).json({message: 'Logged exit', pass: true});
            }
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Internal server error' })
        }

    }
}