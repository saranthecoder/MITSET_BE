import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    //createdAt, updatedAt
},{timestamps:true})

const Admin = mongoose.model("Admin",adminSchema);

export default Admin;