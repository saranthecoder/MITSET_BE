import User from "../models/user.model.js";
import generateTokenSetCookie from "../utils/generateToken.js";
import Question from "../models/question.model.js";

// ---------------------user signup----------------------- ✅
export const signUpUser = async (req, res) => {
    console.log("signUpUser")
    try {
        const { hallTicketNo, dateOfBirth } = req.body;

        const user = await User.findOne({ hallTicketNo });
        if (user) {
            return res.status(400).json({ error: "User Already Exists" });
        }

        // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`
        // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`

        const newUser = new User({
            hallTicketNo,
            dateOfBirth
            // profilePic: gender === 'male' ? boyProfilePic : girlProfilePic
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

        if (!user) {
            return res.status(400).json({ error: "Invalid Hall Ticket Number" });
        }

        // Compare the user-provided date of birth with the stored date
        const isDOBCorrect = user.dateOfBirth.toISOString().split('T')[0] === dateOfBirth;

        if (!isDOBCorrect) {
            return res.status(400).json({ error: "Invalid Date of Birth" });
        }

        generateTokenSetCookie(user._id, res);

        console.log("User Logged In");
        res.status(200).json({
            _id: user._id,
            hallTicketNo: user.hallTicketNo,
            dateOfBirth: user.dateOfBirth,
            // profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
};


// ------------- getting question paper for the user----------------  ✅
export const getUserQP = async (req, res) => {
    try {
        // Retrieve data from the database using find or any other suitable query
        const savedQuestions = await Question.find();

        // Extract subject, question, and options ids with text from the retrieved data
        const response = savedQuestions.map((subjectData) => {
            const { _id: subjectId, subject, data } = subjectData;
            const questions = data.map((questionData) => {
                const { _id: questionId, question, options } = questionData;
                const optionsData = options.map((option) => ({
                    _id: option._id,
                    text: option.text
                }));

                return { questionId, question, options: optionsData };
            });

            return { subjectId, subject, data };
        });

        res.status(200).json({ questions: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

