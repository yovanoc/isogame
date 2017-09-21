import Primus from 'primus'
import moment from 'moment'
import AesCtr from './AesCtr'
import Dispatcher from './Dispatcher'

export default class GameClient {

	constructor () {
    this.dispatcher = new Dispatcher()

    var Socket = Primus.createSocket({ transformer: 'engine.io' })
    this.primus = new Socket('http://localhost:2121')

    this.primus.on("open", () => {
      this.Log("Connection opened !")
      var message = {
        id: 1,
        message: 'LoginRequested',
        data: {
          username: 'superusername',
          password: 'secretpassword'
        }
      }
      this.Send(message)
     })

    this.primus.on('data', (data) => {
      this.Log('Plain data: ' + data)
      var decryptedData = AesCtr.decrypt(data, 'aZedç8s,;:ùx$w', 256)
      var parsedMessage = JSON.parse(decryptedData)
      this.Log('Data Received: #' + parsedMessage.id)

      this.dispatcher.emit(parsedMessage.message, parsedMessage)
    })

    this.primus.on('error', (err) => {
      console.error('[' + moment().format("LTS") + '][GameClient] Something horrible has happened', err.stack)
    })

    this.primus.on('reconnect', (opts) => this.Log("Reconnection attempt started"))

    this.primus.on('reconnect scheduled', (opts) => {
      this.Log("Reconnecting in " + opts.scheduled + " ms")
      this.Log("This is attempt " + opts.attempt + " out of " + opts.retries)
    })

    this.primus.on('reconnected', (opts) => this.Log("It took " + opts.duration + " ms to reconnect"))

    this.primus.on('reconnect timeout', (err, opts) => this.Log("Timeout expired : " + err.message))

    this.primus.on('timeout', () => this.Log("Connection timeout."))

    this.primus.on('reconnect failed', (err, opts) => this.Log("The reconnection failed : " + err.message))

    this.primus.on('end', () => this.Log("Connection ended."))

    this.primus.on('close', () => this.Log("Connection closed."))

    this.primus.on('destroy', () => this.Log("Feel the power of my lasers!"))

    this.primus.on('online', () => this.Log("We've regained a network connection."))

    this.primus.on('offline', () => this.Log("We've lost our internet connection."))

    this.primus.on('readyStateChange', (state) => this.Log("readyStateChange : " + state))
	}

	Start () {
    this.primus.open()
  }

	Stop () {
    this.primus.end()
  }

	Send (data) {
    this.primus.write(AesCtr.encrypt(JSON.stringify(data), 'aZedç8s,;:ùx$w', 256))
  }

  Log (message) {
    console.log("[" + moment().format('LTS') + '][GameClient] ' + message)
  }
}
