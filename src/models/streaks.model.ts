import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StudentStreaksSchema = new Schema({
    // Index
    uid: {
        type: String,
        required: true
    },
    // Faculty
    org: {
        type: String,
        required: true,
    },
    streak: {
        type: Number,
        default: 1
    },
    largest_streak: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    }
});

const StudentStreaksModel = mongoose.model('StudentStreaksModel', StudentStreaksSchema, 'streaks');

export default StudentStreaksModel;