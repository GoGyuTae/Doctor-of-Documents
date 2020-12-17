const bodyParser = require('body-parser');
const express = require('express');
const { sequelize } = require('./models/index.js');

var admin = require('firebase-admin');
var serviceAccount = require('./firebase-adminsdk.json');

const models = require('./models');
const apiRouter = require('./routes/apiRouter');
const app = express();

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://document-doctor2.firebaseio.com"
});

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






app.get('/privacy', function (req, res) {
  res.sendFile(__dirname + '/privacy.html');
});


app.get('/', (req, res) => {
  res.send('Running SDC Server \n');
  
 });

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});


