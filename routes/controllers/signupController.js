const Models = require('../../models/');
const bcrypt = require('bcrypt');

module.exports = {
    
    joinUser: (req, res) => {
        let {phone, email, password} = req.body;
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                console.log('bcrypt.genSalt() error : ', err.message);
            } else {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    if(err) {console.log('bcrypt.hash() error : ', err.message);}
                             
                })
                .then((result) =>{
                    password = result;
                    console.log(password);
                    Models.usertable.create ({ 
                        phone : phone,
                        email : email,
                        password : password
                    })
                    .then((result) => {
                        console.log('success join', result.toJSON());
                        res.json({status: 0});
                    })
                    .catch((err) => {
            
                        // 이메일 형식이 아닌경우 (클라이언트 오류 (4xx))
                        if (err.name === 'SequelizeValidationError') {  
                            return res.json({status: 1});
                            //return res.status.json({warn: 'check the email pattern'});
                        }
                        // 이미 가입된 핸드폰 번호의 경우 
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            console.log('join() error : 이미 가입된 핸드폰 번호 \n', err);
                            return res.json({status: 1});
                        
                            
                        }
                        
                        // 서버가 처리 하지 못하는 경우 (5xx)
                        res.status(500).json({error: err});
                        console.log("join err: " , err);
                    });
                })
                .catch((err) => {
                    console.log("bcrypt err: ", err);
                })
                
            }
            
        })
        
    },

    updateUser: (req, res) => {
        Models.usertable.update ({
            phone : req.body.phone,
            email : req.body.email
        }, {
            where: {
                email : req.body.email
            }
        })
        .then((result) => {
            console.log('success update');
            res.status(201).json(result);
            console.log(result);
        })
        .catch((err) => {
            console.log('/updateUser() error : ', err);
        })
    },

    deleteUser: (req, res) => {
        let { email, password } = req.body;
        const user = Models.usertable.findOne({
            where: {
                email : email
            },
        })
        .then((result) => {
            if(!result){
                console.log('가입된 이메일 없음');
            }
            const match = bcrypt.compare(password, result.dataValues.password)
            .then((matchresult) => {
                if(matchresult) {
                    Models.usertable.destroy ({
                        where: {
                            email : req.body.email
                        } 
                    })
                    .then((result) => {
                        console.log(result);
                        res.status(200).json({status: 0});  // delete OK
                    })
                    .catch((err) => {
                        console.log('/deleteUser() error : ', err);
                        res.json({status: 1});
                    })
                }
                else {
                    console.log('password mismatch');
                }
            })
        })
        
    },

    loginUser: (req, res) => {
        let { email, password } = req.body;
        const user = Models.usertable.findOne({
            where: {
                email : email
            },
            
        })
        .then(function(result) {
            if(!result){
                console.log('가입된 이메일 없음');
                res.json({status: 1});
            }
            //res.status(201).json(result);
            console.log(user);
            const match = bcrypt.compare(password, result.dataValues.password)
            .then((matchresult) =>{
                //console.log(result.dataValues.password);
                //console.log(matchresult);
                
                if(user.email = email) {
                console.log('email same')
                if(matchresult) { 
                    console.log('login success');   // 앱과 형식 맞추기
                    console.log(user.email);
                    res.status(200).json({status: 0}); // 앱과 형식 맞춰 파싱
                }
                else {
                    console.log('비밀번호 틀림');
                    res.json({status: 1});
                }
            }
            })
            .catch((err) => {
                console.log('/bcrypt match() error : ', err);
            })
            
            
        })
        .catch((err) => {
            console.log('/loginUser error : ', err);
        })
    },

    checkEmail: (req, res) => {
        Models.usertable.findOne({
            where: { 
                email : req.body.email
            },
        })
        .then((result) => {
            if(result) {
                res.json({status: 1}); // already join this email
                console.log('이미 가입된 이메일');
            }
            else {
                res.json({status: 0}); // join this email
                console.log('사용가능한 이메일');
            }
        })
        .catch((err) => {
            console.log('/checkEmail() error : ', err);
        })
        
    },

    checkPassword: (req, res) => {
        let { email, password } = req.body;
        const user = Models.usertable.findOne({
            where : {
                email : email
            },
        })
        .then((result) => {
            if(!result){
                console.log('가입된 이메일 없음');
            }
            else{
                bcrypt.compare(password, result.dataValues.password)
                .then((matchresult) => {
                    if(matchresult) {
                        res.json({status: 1});
                        console.log('\n비밀번호 동일\n');
                    }
                    else {
                        console.log('\n비밀번호 불일치\n');
                    }
                })
            }
        })
        .catch((err) => {
            console.log('checkPassword() error : ', err);
        })
    },

    changeInfo: (req,res) => {
        let { email, newemail, newpassword, newphone} = req.body;

        if(newemail) {
            Models.usertable.update ({
                email : newemail
            }, {
                where: {
                    email : email
                }
            })
            .then((result) => {
                res.json({status: 0});  // email change success
                console.log('\n이메일 수정완료\n');
            })
        }

        if(newpassword) {
            bcrypt.genSalt(10, function(err, salt) {
                if(err) {
                    console.log('bcrypt.genSalt() error : ', err.message);
                } else {
                    bcrypt.hash(newpassword, salt, null, function(err, hash) {
                        if(err) {console.log('bcrypt.hash() error : ', err.message);}        
                    })
                    .then((result) => {
                        newpassword = result;
                        Models.usertable.update ({
                            password : newpassword
                        }, {
                            where: {
                                email : email
                            }
                        })
                        .then((result) => {
                            res.json({status: 1});  // password change success
                            console.log('\n비밀번호 수정완료\n');
                        })
                        .catch((err) => {
                            console.log('비밀번호 수정오류');
                        })
                    })
                }
            })
        }

        if(newphone) {
            Models.usertable.update ({
                phone : newphone
            }, {
                where: {
                    email : email
                }
            })
            .then((result) => {
                res.json({status: 2});  // phone change success
                console.log('\n휴대폰 번호 수정완료\n');
            })
        }
        
    }
}