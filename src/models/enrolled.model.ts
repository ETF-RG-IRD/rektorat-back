import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RegisteredStudentSchema = new Schema({
    // Date of enroll
    date: {
        type: Date,
        unique: false
    },
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
    group: {
        type: String,
        default: ''
    }
});

const RegisteredStudentModel = mongoose.model('RegisteredStudentModel', RegisteredStudentSchema, 'enrolled');

export default RegisteredStudentModel;