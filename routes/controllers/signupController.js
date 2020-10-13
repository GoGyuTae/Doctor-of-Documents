const models = require('../../models');
const {
    usertable
} = models;

const signupController = {
    joinUser(req, res) {
        
        models.usertable.create({
            useremail : req.body.useremail,
            name : req.body.name
      })
      
      .then((usertable) => {
            console.log('success postData', usertable.toJSON());   
            
            res.json(
                {
                useremail : usertable.useremail
              }); 
      })
      .catch((err) => {
            console.log(err, req.body.useremail);
        
    
      })
    }
        
}

module.exports = signupController;
