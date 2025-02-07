import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VerifiedStudentSchema = new Schema({
    // Index
    uid: {
        type: String,
        required: true
    },
    // Faculty
    org: {
        type: String,
        required: true,
    }
});

const VerifiedStudentModel = mongoose.model('VerifiedStudentSchema', VerifiedStudentSchema, 'verified');

export default VerifiedStudentModel;