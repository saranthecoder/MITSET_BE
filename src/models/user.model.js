import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    hallTicketNo: {
        type: Number,
        required: true,
        unique: true
    },

    dateOfBirth: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
