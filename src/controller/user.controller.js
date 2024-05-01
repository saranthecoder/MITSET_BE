import shuffle from 'lodash/shuffle.js';
import generateTokenSetCookie from "../utils/generateToken.js";
import Question from "../models/question.model.js";
import UserAnswer from '../models/userAnswer.model.js';
import UserReg from '../models/userSignup.model.js';
import StartTime from '../models/getTime.model.js';

// ---------------------user signup----------------------- ✅

// Function to generate a random 10-digit number
function generateHallTicketNo() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

export const signUpUser = async (req, res) => {
    console.log("signUpUser");
    try {
        const userData = req.body;

        const { aadharNumber } = userData;

        // Check if the user with the given Aadhar number already exists
        const userExists = await UserReg.findOne({ aadharNumber });
        if (userExists) {
            return res.status(400).json({ error: "User Already Exists with this Aadhar number" });
        }

        // Check if the hall ticket number already exists
        let hallTicketNo = generateHallTicketNo();
        let hallTicketExists = await UserReg.findOne({ hallTicketNo });
        while (hallTicketExists) {
            // Regenerate hall ticket number until it's unique
            hallTicketNo = generateHallTicketNo();
            userExists = await UserReg.findOne({ hallTicketNo });
        }

        // Create a new user with the provided data and generated hall ticket number
        const newUser = new UserReg({
            ...userData,
            hallTicketNo: hallTicketNo
        });

        // Save the new user to the database
        await newUser.save();
        console.log("New User Created");

        console.log(newUser);

        // Return the response with the generated hall ticket number
        res.status(201).json({
            _id: newUser._id,
            hallTicketNo: newUser.hallTicketNo,
            dateOfBirth: newUser.dateOfBirth,
            // profilePic: newUser.profilePic
        });

    } catch (error) {
        console.log("Error in signUpUser", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



//-----------------user login---------------- ✅
export const logInUser = async (req, res) => {
    try {
        const { hallTicketNo, dateOfBirth } = req.body;
        const user = await UserReg.findOne({ hallTicketNo });
        // console.log(user)

        if (!user) {
            return res.status(400).json({ error: "Invalid Hall Ticket Number" });
        }

        // Compare the user-provided date of birth with the stored date
        const isDOBCorrect = user.dateOfBirth.toISOString().split('T')[0] === dateOfBirth;

        if (!isDOBCorrect) {
            return res.status(400).json({ success: false, error: "Invalid Date of Birth" });
        }

        generateTokenSetCookie(user._id, res);

        const getTime = await StartTime.findOne();

        console.log("User Logged In");
        res.status(200).json({ id: user._id, success: true, examStart:getTime.startTime});
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ success: false, error: "Internal Server error" });
    }
};


// ------------- getting question paper for the user----------------  ✅

// shuffled question paper ✅
export const getUserQP = async (req, res) => {
    try {
        // Retrieve data from the database 
        const savedQuestions = await Question.find();

        // Extract subject, question, and options ids with text from the retrieved data
        const shuffledResponse = savedQuestions.map((subjectData) => {
            const { _id: subjectId, subject, data } = subjectData;

            // Shuffle the order of questions for each subject
            const shuffledQuestions = shuffle(data.map((questionData) => {
                const { _id: questionId, question, options } = questionData;

                // Shuffle the options for each question
                const shuffledOptions = shuffle(options);

                return { questionId, question, options: shuffledOptions };
            }));

            return { subjectId, subject, data: shuffledQuestions };
        });

        res.status(200).json({ questions: shuffledResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ------------------- submit answer --------------------- ✅
export const storeUserAnswerData = async (req, res) => {

    let physicsData, chemistryData, mathematicsData;
    // let physicsDataDB, chemistryDataDB, mathematicsDataDB;

    try {

        const hallTicketNo = req.user.hallTicketNo;
        const dateOfBirth = req.user.dateOfBirth

        // Extract data from the request body
        const { questions } = req.body;
        questions.forEach(element => {
            if (element.subject == 'physics') {
                physicsData = element.data;
                console.log(typeof (physicsData));
            } else if (element.subject == 'chemistry') {
                chemistryData = element.data;
            } else if (element.subject == 'mathematics') {
                mathematicsData = element.data;
            }
        });


        const newUserAnswer = new UserAnswer({
            hallTicketNo,
            dateOfBirth: new Date(dateOfBirth),
            questions: [
                { subject: 'physics', data: physicsData },
                { subject: 'chemistry', data: chemistryData },
                { subject: 'mathematics', data: mathematicsData },
            ],
        });

        // Save the new UserAnswer to the database  
        await newUserAnswer.save();

        res.cookie("jwt", "", { maxAge: 0 }); // token got expire

        res.status(201).json({ success: true, message: 'Hall ticket data saved successfully.' });
    } catch (error) {
        console.error('Error saving hall ticket data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};
