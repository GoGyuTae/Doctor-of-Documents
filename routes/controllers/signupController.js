const Models = require('../../models/');
const bcrypt = require('bcrypt');

module.exports = {
    
    joinUser: (req, res) => {
        let {email, name, password} = req.body;
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                console.log('bcrypt.genSalt() errer : ', err.message);
            } else {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    if(err) {console.log('bcrypt.hash() errer : ', err.message);}
                             
                })
                .then((result) =>{
                    password = result;
                    console.log(password);
                    Models.usertable.create ({ 
                        email : email, 
                        name : name,
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
                        // 이미 가입된 이메일인 경우 
                        if (err.name === 'SequelizeUniqueConstraintError') {
                            return res.status(400).json({warn: 'Already join email'});
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
            email : req.body.newemail,
            name : req.body.name
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
            console.log(err, req.body.email);
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
        })
        .catch((err) => {
            console.log(err, req.body.email);
        })
        
    },

    loginUser: (req, res) => {
        const { input_email, input_password } = req.body;
        Models.usertable.findOne({
            where: {
                email : input_email
            },
            
        })
        .then(function(result) {
            if(!result){
                console.log('가입된 이메일 없음');
            }
            res.status(201).json(result);
            
            if(result.email == input_email) {
                console.log('email same')
                if(result.password == input_password) { //password = name
                    console.log('login success');
                }
                else {
                    console.log('비밀번호 틀림');
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

}