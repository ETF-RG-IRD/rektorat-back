import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExitLogSchema = new Schema({
    date_entry: {
        type: Date,
        required: true
    },
    date_exit: {
        type: Date,
        required: true
    },
    UUID: {
        type: String,
        required: true
    }
});

const ExitLogModel = mongoose.model('ExitLogModel', ExitLogSchema, 'exit_log');

export default ExitLogModel;