// Import Mongoose
import mongoose from 'mongoose';

// Define schema for questions
const QuestionSchema = new mongoose.Schema({
    question: String,
    options: String
});

// Define schema for subjects
const SubjectSchema = new mongoose.Schema({
    subject: String,
    data: [QuestionSchema]
});

// Define schema for storing hall ticket information
const userAnswerSchema = new mongoose.Schema({
    hallTicketNo: Number,
    dateOfBirth: Date,
    questions: [SubjectSchema]
});

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

export default UserAnswer;
