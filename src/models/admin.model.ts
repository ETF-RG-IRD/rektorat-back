import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const AdminModel = mongoose.model('AdminModel', adminSchema, 'admin');

export default AdminModel;