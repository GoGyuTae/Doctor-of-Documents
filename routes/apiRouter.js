const express = require('express');
const notificationController = require('./controllers/notificationController');
const router = express.Router();
const signupController = require('./controllers/signupController');

// 회원가입 처리 라우터
router.post('/join', signupController.joinUser);
router.post('/update', signupController.updateUser);
router.post('/delete', signupController.deleteUser);
router.post('/login', signupController.loginUser);
router.post('/checkEmail', signupController.checkEmail);
router.post('/checkPassword', signupController.checkPassword);
router.post('/changeInfo', signupController.changeInfo);
router.post('/checkNickname', signupController.checkName);
router.post('/logout', signupController.logoutUser);

router.post('/notification', notificationController.displayNotification);




router.post('/addfriend', notificationController.addfriend);
router.post('/acceptfriend', notificationController.acceptfriend);
router.post('/rejectfriend', notificationController.rejectfriend);
router.post('/friendlist', notificationController.friendlist);
router.post('/applicationlist', notificationController.applicationlist);
router.post('/deletefriend', notificationController.deletefriend);




module.exports = router;