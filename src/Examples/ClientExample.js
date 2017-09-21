import Client from '../Network/Client'

export default class ClientExample {
  constructor () {
    this.client = new Client

    this.register()
  }

  register () {
    this.client.dispatcher.register('LoginAccepted', this.OnLoginAccepted, this)
    this.client.dispatcher.register('LoginRefused', this.OnLoginRefused, this)
  }

  OnLoginAccepted (client, message) {
    var account = message.data.account
    console.log(`${account.username} have ${account.money} money.`)
  }

  OnLoginRefused (client, message) {
    console.log(`${client.getId()} : ${message.data.reason}`)
  }
}
