const mqtt = require ('mqtt');
const lockBike = require('../functions/lockBike');
const isnewbike = require('../functions/isNewBike');

var client  = mqtt.connect('mqtts://159.65.153.162',{
    port: 8883,
    username: 'server',
    password: 'perarideserver',
    clientId: 'peraride_server',
    rejectUnauthorized: false
});

client.on('connect', function() { 
    console.log('connected to mqtt broker');
    client.subscribe('PeraRide/redock/lock2');
    client.subscribe('PeraRide/redock/lock3'); 
    client.subscribe('PeraRide/redock/lock4');     
});

client.on('message', function(topic,payload) { // When connected
    console.log('message received to ' + topic.toString());    
    var body = {
        lock_id: topic.toString().replace('PeraRide/redock/lock',''),
        bike_id: payload.toString()
    }

    isnewbike.isNewBike(body)
    .then(() => {
        return lockBike.lockBike(body);
    }).then((res)=>{
        console.log(res.response);

    }).catch((err)=>{
        console.log(err.response);
    })
});

module.exports = {
    client: client,
    undockTopic: 'PeraRide/unlock/dock'
  };
