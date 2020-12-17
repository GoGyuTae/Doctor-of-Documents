const bodyParser = require('body-parser');
const express = require('express');
const { sequelize } = require('./models/index.js');

var admin = require('firebase-admin');
var serviceAccount = require('./firebase-adminsdk.json');

const models = require('./models');
const apiRouter = require('./routes/apiRouter');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var nicknames = [];

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

app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/chatclient3.html');
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


/* io.on('connection', function(socket){

  console.log("New Client! connect");
  
  socket.on('msg', function (data) {
    console.log(data);
    socket.emit('recMsg', {comment: instanceId + ":" + data.comment+'\n'});
  })

}); */



/* var count=1;
io.on('connection', function(socket){ 
  	console.log('user connected: ', socket.id);  
  	var name = "익명" + count++;                 
	socket.name = name;
  	io.to(socket.id).emit('create name', name);   
	io.emit('new_connect', name);
	
	socket.on('disconnect', function(){ 
	  console.log('user disconnected: '+ socket.id + ' ' + socket.name);
	  io.emit('new_disconnect', socket.name);
	});

	socket.on('send message', function(name, text){ 
		var msg = name + ' : ' + text;
		if(name != socket.name)
			io.emit('change name', socket.name, name);
		socket.name = name;
    	console.log(msg);
    	io.emit('receive message', msg);
	});
	
}); */

io.sockets.on('connection', function(socket) {
	socket.on('new user', function(data, callback){
		if(nicknames.indexOf(data) != -1){
			callback(false);
		} else{
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			//io.sockets.emit('usernames', nicknames); // 닉네임 실시간
			updateNicknames();
		}
	});

	function updateNicknames() {
		io.sockets.emit('usernames', nicknames);
	}


	socket.on('send message', function(data) {
		// io.sockets.emit('new message', data);
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
	});

	socket.on('disconnect', function(data) {
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexOf(socket.nickname), 1);
		updateNicknames();
	})
});




