import Server from '../Network/Server'
import Database from '../Database'

export default class ServerExample {
  constructor () {
    this.db = new Database
    this.server = new Server

    this.register()
  }

  register () {
    this.server.dispatcher.register('LoginRequested', this.OnLoginRequested, this)
  }

  async OnLoginRequested (spark, message) {
    // var account = await this.db.accounts.set(message.data)
    var account = {
      username: 'TuCTo4DVjETCr8zwAAAH',
      password: 'secretpassword'
    }

    // await this.db.accounts.delete(account)

    try {
      var accountGet = await this.db.accounts.get(account.username, account.password)
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
      this.server.send(spark, message)
    }
  }
}
