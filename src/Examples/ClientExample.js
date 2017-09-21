import Client from '../Network/Client'

export default class ClientExample {
  constructor () {
    this.client = new Client

    this.register()
    this.events()
  }

  events () {
    this.client.dispatcher.register('connected', this.onConnected, this)
  }

  register () {
    this.client.dispatcher.register('LoginAccepted', this.onLoginAccepted, this)
    this.client.dispatcher.register('LoginRefused', this.onLoginRefused, this)
  }

  onConnected () {
    var message = {
      id: 1,
      message: 'LoginRequested',
      data: {
        username: this.client.getId(),
        password: 'secretpassword'
      }
    }

    this.client.send(message)
  }

  onLoginAccepted (client, message) {
    var account = message.data.account
    console.log(`${account.username} have ${account.money} money.`)
  }

  onLoginRefused (client, message) {
    console.log(`${client.getId()} : ${message.data.reason}`)
  }
}
