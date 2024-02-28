import express from 'express';
import protectRoute from '../middleware/userProtectingRoutes.js';
import { getUserQP, logInUser, signUpUser,storeUserAnswerData } from '../controller/user.controller.js';

const router = express.Router();

router.post('/signup', signUpUser);  // ✅

router.post('/loginUser', logInUser);  // ✅


// Protect the route for getting user question papers ✅
router.get('/getQuestionPaper', protectRoute, getUserQP);

router.post('/submitQuestionPaper', protectRoute, storeUserAnswerData);// create submit and logout ✅

export default router;
