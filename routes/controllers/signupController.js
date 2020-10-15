const express = require('express')
const Models = require('../../models/');

module.exports = {
    joinUser: (req, res) => {
        console.log(req.body);
        
        Models.usertable.create ({ 
            useremail : req.body.useremail, 
            name : req.body.name
        })
        .then((usertable) => {
            console.log('success join', usertable.toJSON());
            //res.json({useremail : usertable.useremail});
        })
        .catch((err) => {
            console.log(err, req.body.useremail);
        })
    },

    updateUser: (req, res) => {
        Models.usertable.update ({
            useremail : req.body.newuseremail,
            name : req.body.name
        }, {
            where: {
                useremail : req.body.useremail
            }
        })
        .then((usertable) => {
            console.log('success update');
            res.json({useremail : usertable.useremail});
        })
        .catch((err) => {
            console.log(err, req.body.useremail);
        })
    },

    deleteUser: (req, res) => {
        Models.usertable.destroy ({
            where: {
                useremail : req.body.useremail
            }
        })
        .catch((err) => {
            console.log(err, req.body.useremail);
        })
        
    }

}