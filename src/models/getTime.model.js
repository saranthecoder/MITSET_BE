import mongoose from "mongoose";

const setTimeSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    }
});

const StartTime = mongoose.model("StartTime", setTimeSchema); // Use setTimeSchema, not setTime

export default StartTime;
