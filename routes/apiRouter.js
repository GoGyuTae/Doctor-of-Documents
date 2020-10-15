const express = require('express');
const router = express.Router();
const signupController = require('./controllers/signupController');

// 회원가입 처리 라우터
router.post('/join', signupController.joinUser);
router.post('/update', signupController.updateUser);
router.post('/delete', signupController.deleteUser);

module.exports = router;