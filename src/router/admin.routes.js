import express from 'express';
import { logInAdmin, logOutAdmin, signUpAdmin, addQuestionPaper } from '../controller/admin.controller.js';
import adminProtectingRouter from '../middleware/adminProtectingRouter.js'

const router = express.Router();

router.post('/signupAdmin', signUpAdmin);  // ✅

router.post('/loginAdmin', logInAdmin);  // ✅

router.post('/logoutAdmin', logOutAdmin);  // ✅

// Protect the route for adding question paper
router.post('/addQuestionPaper', adminProtectingRouter, addQuestionPaper);  // ✅


export default router;