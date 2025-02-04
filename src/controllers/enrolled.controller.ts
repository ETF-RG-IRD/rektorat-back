import express from 'express'
import RegisteredStudentModel from '../models/enrolled.model';
import StudentStreaksModel from '../models/streaks.model';
import { toZonedTime, format } from 'date-fns-tz';
export class EnrollController {
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
                console.log(`* INFO: Student's first time being registered ➡ uID: ${uid} ; org: ${org} @ ${zoned_today}`);

                await RegisteredStudentModel.create({
                    uid: uid,
                    org: org,
                    date: zoned_today
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
                console.log(`* INFO: Found student ➡ uID: ${uid} ; org: ${org}`);

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
                    console.log(`* INFO: Incremented student streak by 1`);
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
                    console.log(`* INFO: Reset student streak to 1`);
                }


                // Register the student for today

                await RegisteredStudentModel.create({
                    uid: uid,
                    org: org,
                    date: zoned_today
                });

                // Return response with last registration date and student details
                res.status(200).json({
                    new: false,
                    uid: uid,
                    org: org,
                    last_seen: format(registered_student.date!, 'dd-MM-yyyy HH:mm', { timeZone: time_zone })
                });
            }
            console.log(`\t✅ SUCCESS: Registered student for today!`);
        } catch (error) {
            console.error("Error enrolling student:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}