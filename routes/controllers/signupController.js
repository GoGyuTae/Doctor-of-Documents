const Models = require('../../models/');
const bcrypt = require('bcrypt-nodejs');

function insertToken(token, email) {
    Models.usertable.update ({
        token : token,
    }, {
        where: {
            email : email
        }
    })
    .then((result) => {
        console.log('success insertToken');
        //console.log(result);
    })
    .catch((err) => {
        console.log('/updateUser() error : ', err);
    })
}
module.exports = {
    
    joinUser: (req, res) => {
        let {phone, email, password, name} = req.body;
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                console.log('bcrypt.genSalt() error : ', err.message);
            } else {
                bcrypt.hash(password, salt, null, function(err, hash) {

                    password = hash;
                    Models.usertable.create ({ 
                        phone : phone,
                        email : email,
                        password : password,
                        name : name
                    })
                    .then((result) => {
                        console.log('success join', result.toJSON());
                        res.json({status: 0});
                    })
                    .catch((err) => {
            
                        // 이메일 형식이 아닌경우 (클라이언트 오류 (4xx))
                        if (err.name === 'SequelizeValidationError') {
                            console.log(err);  
                            return res.json({status: 1});
                            //return res.status.json({warn: 'check the email pattern'});
                        }
                        // 이미 가입된 핸드폰 번호의 경우 
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            console.log('join() error : 이미 가입된 핸드폰 번호 \n', err);
                            console.log(err.toJSON());
                            return res.json({status: 1});
                        
                            
                        }
                        
                        // 서버가 처리 하지 못하는 경우 (5xx)
                        //res.status(500).json({error: err});
                        //console.log("join err: " , err);
                    });

                    if(err) {console.log('bcrypt.hash() error : ', err.message);}
                    else { console.log(hash); }
                    
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
            const match = bcrypt.compare(password, result.dataValues.password, function(err, matchresult) {
                if(matchresult) {
                    Models.usertable.destroy ({
                        where: {
                            email : req.body.email
                        } 
                    })
                    .then((result) => {
                        console.log(result);
                        res.json({status: 0});  // delete OK
                    })
                    .catch((err) => {
                        console.log('/deleteUser() error : ', err);
                        res.json({status: 1});
                    })
                }
                else {
                    console.log('password mismatch', err);
                }

            })
        
        })
        
    },

    loginUser: (req, res) => {
        let { email, password, token } = req.body;
        console.log('\n로그인시도 email:  ', email);
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
            const match = bcrypt.compare(password, result.dataValues.password, function(err, matchresult) {

                if(user.email = email) {
                    //console.log('email 확인 :', user.email);
                    console.log('email same')
                    if(matchresult) { 
                        //console.log('login success');   // 앱과 형식 맞추기
                        console.log('--- success login ---');
                        console.log(user.email + " and " + result.dataValues.name);
                        res.json({name: result.dataValues.name, phone: result.dataValues.phone}); // 앱과 형식 맞춰 파싱*/
                        
                        insertToken(token, email);
                    }
                    else {
                        console.log('비밀번호 틀림');
                        res.json({status: 1});
                    }
                }
                else {

                }

            })
        })
        .catch((err) => {
            console.log('/loginUser error : ', err);
        })
    },

    logoutUser: (req, res) => {
        var setdefault = "default";
        Models.usertable.update ({
            token : setdefault
        }, {
            where: {
                email : req.body.email
            }
        })
        .then((result) => {
            res.json({logout: 0});  // 
            console.log(result, '  로그아웃\n');
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

    checkName: (req, res) => {
        
        Models.usertable.findOne({
            where: { 
                name : req.body.name
            },
        })
        .then((result) => {
            if(result) {
                res.json({status: 2}); // already use this name
                //console.log('이미 사용중인 닉네임');
            }
            else {
                res.json({status: 0}); // join this email
                
                //console.log('사용가능한 닉네임');
            }
        })
        .catch((err) => {
            console.log('/checkName() error : ', err);
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
                bcrypt.compare(password, result.dataValues.password, function(err, matchresult) {

                    if(matchresult) {
                        res.json({status: 1});
                        console.log('\n checkPassword 비밀번호 동일\n');
                    }
                    else {
                        res.json({status: 'passwordfail'});
                        console.log('\n checkPassword 비밀번호 불일치\n');
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
            
            Models.usertable.findOne({
                where: { 
                    email : req.body.newemail
                },
            })
            .then((result) => {
                if(result) {
                    res.json({status: 3}); // 중복된 이메일로 변경시도
                    console.log('\n중복된 이메일로 변경 시도\n');
                }
                else{
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
            })
            .catch((err) => {
                console.log('/checkEmail() error : ', err);
            })
            
        }

        if(newpassword) {
            bcrypt.genSalt(10, function(err, salt) {
                if(err) {
                    console.log('bcrypt.genSalt() error : ', err.message);
                } else {
                    bcrypt.hash(newpassword, salt, null, function(err, hash) {
                        if(err) {console.log('bcrypt.hash() error : ', err.message);}
                        
                        newpassword = hash;
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