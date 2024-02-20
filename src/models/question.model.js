import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    }
});

const questionDataSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [optionSchema]
});

const subjectSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    data: [questionDataSchema]
}, { timestamps: true });

const Question = mongoose.model("Question", subjectSchema);

export default Question;
