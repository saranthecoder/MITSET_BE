import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true,
    },

    dateOfBirth: {
        type: Date,
        required: true
    },
    aadharNumber:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    hallTicketNo:{
        type: String,
        required: true, 
    }
}, { timestamps: true });

const UserReg = mongoose.model("UserRegistration", userSchema);

export default UserReg;
