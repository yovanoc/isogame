import GameServer from './GameServer'
import GameClient from './GameClient'
import Database from './Database'

//////////////////////////// Variables ////////////////////////////

var db = new Database
var server = new GameServer
var client = new GameClient

//////////////////////////// Redis ////////////////////////////

db.redis.on('connect', () => console.log('Connected to Redis...'))
db.redis.on('error', (error) => {
  console.log(error.message)
  server.stop()
})

//////////////////////////// Server ////////////////////////////

server.dispatcher.register('LoginRequested', OnLoginRequested)

async function OnLoginRequested (spark, message) {

  var account = await db.setAccount(message.data)
  // var account = {
  //   username: 'ol6NnJFnuyP5aBGKAAAA',
  //   password: 'secretpassword'
  // }

  try {
    var accountGet = await db.getAccount(account.username, account.password)
    var message = {
      id: 2,
      message: 'LoginAccepted',
      data: {
        account: accountGet
      }
    }
  } catch (e) {
    var message = {
      id: 3,
      message: 'LoginRefused',
      data: {
        reason: e
      }
    }
  } finally {
    server.send(spark, message)
  }
}

//////////////////////////// Client ////////////////////////////

client.dispatcher.register('LoginAccepted', OnLoginAccepted)
client.dispatcher.register('LoginRefused', OnLoginRefused)

async function OnLoginAccepted (client, message) {
  var account = message.data.account
  console.log(`${account.username} have ${account.money} money.`)

  var accounts = await db.getAllAccounts()
  console.log("There is %d accounts in the database", accounts.length)
}

function OnLoginRefused (client, message) {
  console.log(`${client.getId()} : ${message.data.reason}`)
}

// for (var i = 0; i < 2; i++) {
//   var client = new GameClient
//   client.dispatcher.register('LoginAccepted', OnLoginAccepted)
//   client.dispatcher.register('LoginRefused', OnLoginRefused)
// }
