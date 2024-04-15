import shuffle from 'lodash/shuffle.js';
import User from "../models/user.model.js";
import generateTokenSetCookie from "../utils/generateToken.js";
import Question from "../models/question.model.js";
import UserAnswer from '../models/userAnswer.model.js';

// ---------------------user signup----------------------- ✅
export const signUpUser = async (req, res) => {
    console.log("signUpUser")
    try {
        const { hallTicketNo, dateOfBirth } = req.body;

        const user = await User.findOne({ hallTicketNo });
        if (user) {
            return res.status(400).json({ error: "User Already Exists" });
        }

        const newUser = new User({
            hallTicketNo,
            dateOfBirth
        })

        if (newUser) {
            //Generate JWT tokens
            generateTokenSetCookie(newUser._id, res);
            await newUser.save();
            console.log("New User Created")
            res.status(201).json({
                _id: newUser._id,
                hallTicketNo: newUser.hallTicketNo,
                dateOfBirth: newUser.dateOfBirth,
                // profilePic: newUser.profilePic
            })
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in SignUpUser", error.message);
        res.status(500).json({ error: "Internal Server error" })

    }
}


//-----------------user login---------------- ✅
export const logInUser = async (req, res) => {
    try {
        const { hallTicketNo, dateOfBirth } = req.body;
        const user = await User.findOne({ hallTicketNo });
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

        console.log("User Logged In");
        res.status(200).json({ id: user._id, success: true });
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
                console.log(typeof(physicsData));
            } else if (element.subject == 'chemistry') {
                chemistryData = element.data;
            } else if (element.subject == 'mathematics') {
                mathematicsData = element.data;
            }
        });


        // const questionsDB = await Question.find({});
        // questionsDB.forEach(element => {
        //     if (element.subject == 'physics') {
        //         physicsDataDB = element.data;
        //         console.log(physicsDataDB);
        //     } else if (element.subject == 'chemistry') {
        //         chemistryDataDB = element.data;
        //     } else if (element.subject == 'mathematics') {
        //         mathematicsDataDB = element.data;
        //     }
        // });

        // const physicsAnswers = await saveAnswers(physicsData, physicsDataDB);
        // const chemistryAnswers = await saveAnswers(chemistryData, chemistryDataDB);
        // const mathematicsAnswers = await saveAnswers(mathematicsData, mathematicsDataDB);

        const newUserAnswer = new UserAnswer({
            hallTicketNo,
            dateOfBirth: new Date(dateOfBirth),
            questions: [
                { subject: 'physics', data: physicsData},
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


/*
async function saveAnswers(data, dataDB) {
    try {
        const answers = [];

        for (const item of data) {
            const storedQuestion = dataDB.find(q => q.question === item.question);

            if (storedQuestion) {
                const selectedOption = storedQuestion.options.find(
                    option => option.text === item.options
                );

                if (selectedOption) {

                    answers.push({
                        question: storedQuestion._id,
                        options: selectedOption._id
                    });
                }
            }
        }

        return answers;
    } catch (error) {
        console.error("Error in saveAnswers function:", error);
    }
}

*/