import Primus from 'primus'
import moment from 'moment'
import AesCtr from './AesCtr'
import Dispatcher from './Dispatcher'

export default class GameServer {

  constructor () {
    this.sparks = []
    this.dispatcher = new Dispatcher()

    this.primus = Primus.createServer((spark) => {
      this.log("[" + spark.id + "] Connected.")

      spark.on('data', (data) => {
        // this.log("[" + spark.id + "] Plain data : " + data)

        var decryptedData = AesCtr.decrypt(data, 'aZedç8s,;:ùx$w', 256)
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
    }, { port: 2121, transformer: 'engine.io'})

    this.events()
  }

  events () {
    this.primus.on('initialised', () => this.log("Initialised."))

    this.primus.on('close', () => this.log("The server has been destroyed."))

    this.primus.on('connection', () => {
      this.log("We received a new connection.")
      this.log("We have " + this.primus.connected + " sparks.")

      // this.primus.forEach((spark, next) => {
      //   console.log(spark.id)
      //   next()
      // }, (err) => {
      //   console.log('We are done');
      // })
    })

    this.primus.on('disconnection', () => this.log("We received a disconnection."))

    this.primus.on('plugin', () => this.log("A new plugin has been added."))

    this.primus.on('plugout', () => this.log("A plugin has been removed."))

    this.primus.on('log', (data) => this.log("Log : " + data))
  }

  stop () {
    // close Close the HTTP server that Primus received. Defaults to true.
    // reconnect Automatically reconnect the clients. Defaults to false.
    // timeout Close all active connections and clean up the Primus instance after the specified amount of timeout. Defaults to 0.
    this.primus.destroy({ timeout: 200 })
  }

  send (spark, data) {
    spark.write(AesCtr.encrypt(JSON.stringify(data), 'aZedç8s,;:ùx$w', 256))
  }

  log (message) {
    console.log("[" + moment().format('LTS') + '][GameServer] ' + message)
  }
}
