const bodyParser = require('body-parser');
const express = require('express');
const { sequelize } = require('./models/index.js');
const app = express();
const models = require('./models');

const apiRouter = require('./routes/apiRouter');
app.use('/api', apiRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//model.sync();

models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});



app.get('/', (req, res) => {
  res.send('Hello World!\n');
  
 });

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});








app.post('/postData', async(req, res) => {
  

  /*
  try{
    const user = await models.user.create({ 
      useremail : req.body.useremail, 
      name : req.body.name,
     });

    console.log('succcess', user.toJSON());
    
    res.json(
      {
      useremail : user.useremail
    });

  } catch (err) {
    console.log(err, req.body.useremail);
  }
*/



  models.usertable.create({
    useremail : req.body.useremail,
    name : req.body.name,

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



});

