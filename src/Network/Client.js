import Primus from 'primus'
import moment from 'moment'
import AesCtr from '../Utility/Aes/AesCtr'
import Dispatcher from '../Utility/Dispatcher'

export default class Client {

	constructor () {
    this.secret = 'aZedç8s,;:ùx$w'

    this.dispatcher = new Dispatcher()

    var Socket = Primus.createSocket({ transformer: 'engine.io' })
    this.primus = new Socket('http://localhost:2121')

    this.primus.on("open", () => {
      this.log("Connection opened !")
      this.dispatcher.emit('connected')
    })

    this.primus.on('data', (data) => {
      // this.log('Plain data: ' + data)
      var decryptedData = AesCtr.decrypt(data, this.secret, 256)
      var parsedMessage = JSON.parse(decryptedData)
      // this.log('Data Received: #' + parsedMessage.id)
      this.dispatcher.emit(parsedMessage.message, this, parsedMessage)
    })

    this.primus.on('error', (err) => {
      console.error('[' + moment().format("LTS") + '][Client] Something horrible has happened', err.stack)
    })

    this.primus.on('reconnect', (opts) => this.log("Reconnection attempt started"))

    this.primus.on('reconnect scheduled', (opts) => {
      this.log("Reconnecting in " + opts.scheduled + " ms")
      this.log("This is attempt " + opts.attempt + " out of " + opts.retries)
    })

    this.primus.on('reconnected', (opts) => this.log("It took " + opts.duration + " ms to reconnect"))

    this.primus.on('reconnect timeout', (err, opts) => this.log("Timeout expired : " + err.message))

    this.primus.on('timeout', () => this.log("Connection timeout."))

    this.primus.on('reconnect failed', (err, opts) => this.log("The reconnection failed : " + err.message))

    this.primus.on('end', () => this.log("Connection ended."))

    this.primus.on('close', () => this.log("Connection closed."))

    this.primus.on('destroy', () => this.log("Feel the power of my lasers!"))

    this.primus.on('online', () => this.log("We've regained a network connection."))

    this.primus.on('offline', () => this.log("We've lost our internet connection."))

    this.primus.on('readyStateChange', (state) => this.log("readyStateChange : " + state))
	}

  getId () {
    return this.primus.id((id) => id)
  }

	start () {
    this.primus.open()
  }

	stop () {
    this.primus.end()
  }

	send (data) {
    this.primus.write(AesCtr.encrypt(JSON.stringify(data), this.secret, 256))
  }

  log (message) {
    console.log("[" + moment().format('LTS') + '][Client] ' + message)
  }
}
