const bodyParser = require('body-parser');
const express = require('express');
const { sequelize } = require('./models/index.js');
const app = express();
const models = require('./models');
const apiRouter = require('./routes/apiRouter');

/*app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));*/
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


app.use('/api', apiRouter);


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










