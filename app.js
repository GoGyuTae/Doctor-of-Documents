const bodyParser = require('body-parser');
const express = require('express');
const { sequelize } = require('./models/index.js');

const models = require('./models');
const apiRouter = require('./routes/apiRouter');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/*app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));*/
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


app.use('/api', apiRouter);


//model.sync();

/*models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});*/

io.on('connection', function(socket){

  console.log("New Client! connect");
  socket.on('msg', function (data) {
    console.log(data);
    socket.emit('recMsg', {comment: instanceId + ":" + data.comment+'\n'});
  })

});




app.get('/privacy', function (req, res) {
  res.sendFile(__dirname + '/privacy.html');
});

app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/chatclient.html');
});

app.get('/', (req, res) => {
  res.send('Running SDC Server \n');
  
 });

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

server.listen(5000, () => {
  console.log('Socket.io Listening on port 5000');
});









