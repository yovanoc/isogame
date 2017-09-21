import 'babel-polyfill'
import GameServer from './GameServer'
import GameClient from './GameClient'
import Redis from 'redis'
import AesCtr from './AesCtr'

var server = new GameServer()

// var redis = Redis.createClient();
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

server.dispatcher.register('LoginRequested', OnLoginRequested)

function OnLoginRequested (spark, message) {
  var message = {
    id: 2,
    message: 'LoginAccepted',
    data: {
      money: 99
    }
  }
  server.Send(spark, message)
}

///////////////// CLIENT ///////////////////

var client = new GameClient()

client.dispatcher.register('LoginAccepted', OnLoginAccepted)

function OnLoginAccepted (message) {
  client.Log('Money: ' + message.data.money)
}
