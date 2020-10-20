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
                        res.status(201).json(result);
                    })
                    .catch((err) => {
            
                        // 이메일 형식이 아닌경우 (클라이언트 오류 (4xx))
                        if (err.name === 'SequelizeValidationError') {  
                            return res.status(400).json({warn: 'check the email pattern'});
                        }
                        // 이미 가입된 핸드폰 번호의 경우 
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            console.log('join() error : 이미 가입된 핸드폰 번호 \n', err);
                            return res.status(400).json({warn: 'Already join phoneNumber'});
                            
                        }
                        
                        // 서버가 처리 하지 못하는 경우 (5xx)
                        res.status(500).json({error: err});
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
                
            }
            
        })
        
    },

    updateUser: (req, res) => {
        Models.usertable.update ({
            phone : req.body.phone,
            email : req.body.newemail
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
        Models.usertable.destroy ({
            where: {
                email : req.body.email
            }
        })
        .then((result) => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch((err) => {
            console.log('/deleteUser() error : ', err);
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
            }
            res.status(201).json(result);
            console.log(user);
            const match = bcrypt.compare(password, result.dataValues.password)
            .then((matchresult) =>{
                //console.log(result.dataValues.password);
                //console.log(matchresult);
                
                if(user.email = email) {
                console.log('email same')
                if(matchresult) { 
                    console.log('login success');
                    console.log(user.email);
                }
                else {
                    console.log('비밀번호 틀림');
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
            }
            else {
                res.json({status: 0}); // join this email
            }
        })
        .catch((err) => {
            console.log('/checkEmail() error : ', err);
        })
    }
}