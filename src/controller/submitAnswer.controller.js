import UserAnswer from '../models/userAnswer.model.js';
import Question from '../models/question.model.js';

const submitUserAnswers = async (req, res) => {
    try {
        console.log(req.user.hallTicketNo);
        const { questions } = req.body;
        
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error submitting user answers:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default submitUserAnswers;
