const { get } = require('jquery');
const { Sequelize } = require('../../models/');
const Models = require('../../models/');
var admin = require('firebase-admin');

function getInfo (tophone) {
    return new Promise(function(resolve, reject) {
        Models.usertable.findOne({
            attributes: ['name', 'token'],
            where: {
                phone : tophone
            },
        })
        .then((result) => {
            //console.log('getInfo()가동');
            //console.log(result.dataValues.name);
            var name = result.dataValues.name;
            var token = result.dataValues.token;
            resolve ([name, token]); // userinfo = user? 
        })
        .catch((err) => {
            console.log('getInfo() error (name조회불가) : ', err);
            resolve (err);
            
        })
    })
    
}

function confirmAdd (myphone, tophone) {
    return new Promise(function(resolve, reject) {
        Models.friendtable.findOne({
            where: Sequelize.or(
                {
                    to : myphone,
                    from : tophone,
                },
                {
                    to : tophone,
                    from : myphone,
                })     
        })
        .then((result) => {
            //console.log('\nconfirmADD 결과값 \n', result);
            if(result){
                if(result.dataValues.friendtype == '친구') {    // 이미신청이 들어와서 친구사이인 경우
                    //var check = -1;
                    var check = -1;
                }
                else if(result.dataValues.friendtype == '아직') {   //  친구 신청은 이미했지만 친구사이가 아닌경우 
                    var check = -2;
                }
                //console.log('\ncehck 값\n', check);
            }
            else {
                var check = 1;
            }
            resolve (check);
        })
        .catch((err) => {
            console.log('/confirmAdd() error : ', err);
        })
    })
}

module.exports = {

    displayNotification : (req, res) => {    
        var registrationToken = req.body.token;
        var payload = {
            /*notification: {
                title: req.body.myname,
                body: req.body.myname + "님이 친구 요청을 보냈어요"
            },*/
            data: {
                title: req.body.myname,
                body: req.body.myname + "님이 친구 요청을 보냈어요!"
            }
        };
        admin.messaging().sendToDevice(registrationToken, payload)
        .then(function(response) {
            console.log("Successfully sent message: ", response);
            res.json({response});
        })
        .catch(function(error) {
            console.log("Error sending message: ", error);
        })

    },

    addfriend : async (req, res) => {
        let { tophone, myphone, myname } = req.body;
        const checkadd = await confirmAdd(myphone, tophone);
        //console.log('\n checkadd 값값 \n', checkadd);
        if(checkadd == 1){
            const toname = await getInfo(tophone);
            //console.log('fffff', toname);
            var token = toname[1]; //toname[1] = token
            Models.friendtable.create ({ 
                to : tophone,
                from : myphone,
                fromname : myname,
                toname  : toname[0], //toname[0] = name
            })
            .then((result) => {
                var registrationToken = token;
                var payload = {
                    data: {
                        title: myname,
                        body: myname + "님이 친구 요청을 보냈어요"
                    }
                };
                admin.messaging().sendToDevice(registrationToken, payload)
                .then(function(response) {
                    console.log("Successfully add to friend and sent message: ", response);
                    res.json({'친구신청 완료': response});
                })
                .catch(function(error) {
                    console.log("Error sending message: ", error);
                })
                /*console.log(result);
                console.log(result.dataValues.fromname, '(이)가 ', result.dataValues.toname, '에게 친구추가 신청');
                /*res.json({to : result.dataValues.to, from : result.dataValues.from, name : result.dataValues.name} ); // 앱과 형식 맞춰 파싱
                res.json({status: '친구신청'});*/
            })
            
            .catch((err) => {
                //console.log(err);
                res.json({status: '가입되지않은 사용자'});
            })
        }
        else if(checkadd == -1) {
            console.log('이미등록된 친구');
            res.json({status : '이미 친구사이'} );
        }
        else if(checkadd == -2) {
            console.log('이미신청한 사이');
            res.json({status : '이미 신청한사이'} );
        }
  
            
    },

    acceptfriend : async (req, res) => {
        const info = await getInfo(req.body.tophone);
        var token = info[1]; //info[1] = token
        const info2 = await getInfo(req.body.myphone);
        var name = info2[0];
        Models.friendtable.update ({
            friendtype : '친구',
            status : 1
        }, {
            where: {
                to : req.body.myphone,  // 사용 유저의 핸드폰번호
                from : req.body.tophone // 친구신청을 한 유저의 핸드폰번호
            }
        })
        .then((result) => {
            var registrationToken = token;
                var payload = {
                    data: {
                        title: name,
                        body: name + "님과 친구가 됐어요"
                    }
                };
                admin.messaging().sendToDevice(registrationToken, payload)
                .then(function(response) {
                    console.log("Successfully add to friend and sent message: ", response);
                    res.json({'친구수락 완료': response});
                })
                .catch(function(error) {
                    console.log("Error sending message: ", error);
                })
        })
        .catch((err) => {
            console.log('/acceptfriend() error : ', err);
        })
    },

    rejectfriend : (req, res) => {
        Models.friendtable.destroy ({
            where: {
                to : req.body.myphone,  // 사용 유저의 핸드폰번호
                from : req.body.tophone // 친구신청을 한 유저의 핸드폰번호
            }
        })
        .then((result) => {
            res.json({status: "친구거절"}); 
            console.log(req.body.myphone, '이 친구거절, 테이블에서 삭제\n');
        })
        .catch((err) => {
            console.log('/rejectfriend() error : ', err);
        })
    },

    friendlist : (req, res) => {// 친구목록 표시
        Models.friendtable.findAll({
            attributes: ['from', 'to', 'fromname','toname'],
            where: Sequelize.or(
                {
                    to : req.body.myphone,
                    friendtype : '친구' //status ?
                },
                {
                    from : req.body.myphone,
                    friendtype : '친구'
                })
        })
        .then((result) => {
            console.log('\n친구목록 표시\n');
            //console.log('\n친구목록 표시\n', result);
            res.json({status: "친구목록들 표시", 결과: result});
        })
        .catch((err) => {
            console.log('/friendlist() error : ', err);
        })
    },

    applicationlist : (req, res) => {
        Models.friendtable.findAll({
            attributes: ['to','from', 'fromname'],
            where: {
                to : req.body.myphone,
                friendtype : '아직'
            }
        })
        .then((result) => {
            console.log('\n친구신청목록 표시\n');
            //console.log('\n친구신청목록 표시\n', result);
            res.json({status: "나를 친구신청한 사람들 표시 ", list: result});// 이떄 to ,from fromname 던져주기
        })
        .catch((err) => {
            console.log('/applicationlist() error : ', err);
        })
    },

    deletefriend : (req, res) => {
        Models.friendtable.destroy ({
            where: Sequelize.or(
                {
                    to : req.body.myphone,
                    from : req.body.tophone,
                },
                {
                    to : req.body.tophone,
                    from : req.body.myphone,
                })
        })
        .then((result) => {
            if(result){
                res.json({status: "친구삭제"}); 
                console.log(req.body.myphone, '이 친구삭제, 친구 테이블에서 삭제\n');
            }
            else {
                res.json({status: "친구삭제 실패"}); 
                console.log(req.body.myphone, '이 친구삭제 실패\n');
            }
        })
        .catch((err) => {
            console.log('/deletefriend() error : ', err);
        })
    },
    



}