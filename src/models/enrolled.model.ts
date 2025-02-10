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
    // Work group
    group: {
        type: String,
        default: ''
    },
    // Time of exit
    exit: {
        type: String,
        default: ''
    }
});

const RegisteredStudentModel = mongoose.model('RegisteredStudentModel', RegisteredStudentSchema, 'enrolled');

export default RegisteredStudentModel;