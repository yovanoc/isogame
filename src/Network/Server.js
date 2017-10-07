import Primus from 'primus'
import moment from 'moment'
import AesCtr from '../Utility/Aes/AesCtr'
import Dispatcher from '../Utility/Dispatcher'

export default class Server {

  constructor () {
    this.secret = 'aZedç8s,;:ùx$w'

    this.dispatcher = new Dispatcher()

    // this.primus = Primus.createServer({ port: 2121, transformer: 'engine.io', plugin: 'primus-emit'})

    this.primus = Primus.createServer({ port: 2121, transformer: 'engine.io'})

    this.events()
  }

  events () {
    this.primus.on('initialised', () => {
      this.log("Initialised.")

      this.primus.plugin('emit', require('primus-emit'))
      // this.primus.plugout('emit')
    })

    this.primus.on('close', () => this.log("The server has been destroyed."))

    this.primus.on('connection', (spark) => {
      this.log("We received a new connection.")
      this.log("We have " + this.primus.connected + " sparks.")

      this.log("[" + spark.id + "] Connected.")

      spark.emit('event-name', 'arguments')

      spark.on('data', (data) => {
        // this.log("[" + spark.id + "] Plain data : " + data)
        var decryptedData = AesCtr.decrypt(data, this.secret, 256)
        var parsedMessage = JSON.parse(decryptedData)
        // this.log('Data Received: #' + parsedMessage.id)
        this.dispatcher.emit(parsedMessage.message, spark, parsedMessage)
      })

      spark.on('error', (error) => this.log("[" + spark.id + "] Error : " + error))

      spark.on('heartbeat', () => this.log("[" + spark.id + "] We've received a response to a heartbeat."))

      spark.on('readyStateChange', (state) => this.log("[" + spark.id + "] readyStateChange : " + state))

      spark.on('end', () => {
        this.log("[" + spark.id + "] Disconnected.")
        this.log("Remaining " + this.primus.connected + " sparks.")
      })
    })

    this.primus.on('disconnection', () => this.log("We received a disconnection."))

    this.primus.on('plugin', (name) => this.log(`Plugin ${name} added.`))

    this.primus.on('plugout', (name) => this.log(`Plugin ${name} removed.`))

    this.primus.on('log', (data) => this.log("Log : " + data))
  }

  stop () {
    // close Close the HTTP server that Primus received. Defaults to true.
    // reconnect Automatically reconnect the clients. Defaults to false.
    // timeout Close all active connections and clean up the Primus instance after the specified amount of timeout. Defaults to 0.
    this.primus.destroy({ timeout: 200 })
  }

  send (spark, data) {
    spark.write(AesCtr.encrypt(JSON.stringify(data), this.secret, 256))
  }

  broadcast (data) {
    this.primus.forEach((spark, next) => {
      this.send(spark, data)
      next()
    }, (err) => {
      this.log('Broadcast completed.')
    })
  }

  log (message) {
    console.log("[" + moment().format('LTS') + '][Server] ' + message)
  }
}
