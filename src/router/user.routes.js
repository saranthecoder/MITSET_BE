import express from 'express';
import protectRoute from '../middleware/userProtectingRoutes.js';
import { getUserQP, logInUser, signUpUser } from '../controller/user.controller.js';

const router = express.Router();

router.post('/loginUser', logInUser);  // ✅

router.post('/signup', signUpUser);  // ✅

// after submit logout the user
router.post('/submit',);  // create submit and logout

// Protect the route for getting user question papers
router.get('/getQuestionPaper', protectRoute, getUserQP);

export default router;
