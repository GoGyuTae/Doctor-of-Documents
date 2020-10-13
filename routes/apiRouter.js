const express = require('express');
const router = express.Router();
const signupController = require('./controllers/signupController');

// 회원가입 처리 라우터
router.post('/Join', signupController.joinUser);

module.exports = router;