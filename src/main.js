import Server from './Examples/ServerExample'
import Client from './Examples/ClientExample'

var server = new Server
var client = new Client

printAccountsNumber()

async function printAccountsNumber () {
  var accounts = await server.db.accounts.getAll()
  console.log("There is %d accounts in the database", accounts.length)
}
