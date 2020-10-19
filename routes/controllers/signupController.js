const Models = require('../../models/');

module.exports = {
    joinUser: (req, res) => {
        console.log(req.body);
        
        Models.usertable.create ({ 
            email : req.body.email, 
            name : req.body.name,
            password : req.body.password
        })
        .then((result) => {
            console.log('success join', result.toJSON());
            console.log(result);

        })
        .catch((err) => {

            // 이메일 형식이 아닌경우
            if (err.name === 'SequelizeValidationError') {  
                return res.status(400).json({warn: 'check the email pattern'});
            }
            // 이미 가입된 이메일인 경우
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({warn: 'Already join email'});
            }
            
            res.status(500).json({error: err});
        });
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