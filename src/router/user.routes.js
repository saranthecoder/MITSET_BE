import express from 'express';
import protectRoute from '../middleware/userProtectingRoutes.js';
import { getUserQP, logInUser, signUpUser } from '../controller/user.controller.js';
import storeUserAnswers from '../controller/submitAnswer.controller.js';

const router = express.Router();

router.post('/loginUser', logInUser);  // ✅

router.post('/signup', signUpUser);  // ✅

// Protect the route for getting user question papers ✅
router.get('/getQuestionPaper', protectRoute, getUserQP);

router.post('/submitQuestionPaper', protectRoute, storeUserAnswers);// create submit and logout

export default router;
