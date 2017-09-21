'use strict';require('babel-polyfill');var _GameServer=require('./GameServer');var _GameServer2=_interopRequireDefault(_GameServer);var _GameClient=require('./GameClient');var _GameClient2=_interopRequireDefault(_GameClient);var _redis=require('redis');var _redis2=_interopRequireDefault(_redis);var _AesCtr=require('./AesCtr');var _AesCtr2=_interopRequireDefault(_AesCtr);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var server=new _GameServer2.default;// var redis = Redis.createClient();
//
// redis.on('connect', () => console.log('Connected to Redis...'))
// redis.on('error', (error) => console.log(error.message))
//
// var message = {
//   id: 1,
//   message: 'LoginRequested',
//   data: {
//     username: 'superusername',
//     password: 'secretpassword'
//   }
// }
//
// redis.set('message', JSON.stringify(message), (err, object) => console.log('Data: ' + object, 'Error: ' + err))
// redis.get('message', (err, object) => console.log(JSON.parse(object).data.password))
//
// const secret = 'SuperComplicatedSecretPassword'
//
// const encr = AesCtr.encrypt(JSON.stringify(message), secret, 256)
//
// console.log("Encrypted: " + encr)
//
// const decr = AesCtr.decrypt(encr, secret, 256)
//
// console.log("Decrypted: " + JSON.parse(decr).data.password)
server.dispatcher.register('LoginRequested',OnLoginRequested);function OnLoginRequested(spark,message){var message={id:2,message:'LoginAccepted',data:{money:99}};server.Send(spark,message)}///////////////// CLIENT ///////////////////
var client=new _GameClient2.default;client.dispatcher.register('LoginAccepted',OnLoginAccepted);function OnLoginAccepted(message){client.Log('Money: '+message.data.money)}