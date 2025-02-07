import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    org: {
        type: String,
        required: true
    },
    UUID: {
        type: String,
    }
        
});

const RequestModel = mongoose.model('RequestModel', RequestSchema, 'requests');

export default RequestModel;