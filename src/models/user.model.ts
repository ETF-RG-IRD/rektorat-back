import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    org: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: false,
        default: ''
    }
});

const UserModel = mongoose.model('UserModel', UserSchema, 'user');

export default UserModel;