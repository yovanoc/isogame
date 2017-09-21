import Primus from 'primus'
import moment from 'moment'
import AesCtr from './AesCtr'
import Dispatcher from './Dispatcher'

export default class GameServer {

  constructor () {
    this.sparks = []
    this.dispatcher = new Dispatcher()

    this.primus = Primus.createServer((spark) => {
      this.Log("[" + spark.id + "] Connected.")

      spark.on('data', (data) => {
        this.Log("[" + spark.id + "] Plain data : " + data)

        var decryptedData = AesCtr.decrypt(data, 'aZedç8s,;:ùx$w', 256)
        var parsedMessage = JSON.parse(decryptedData)
        this.Log('Data Received: #' + parsedMessage.id)

        this.dispatcher.emit(parsedMessage.message, spark, parsedMessage)
      })

      spark.on('error', (error) => this.Log("[" + spark.id + "] Error : " + error))

      spark.on('heartbeat', () => this.Log("[" + spark.id + "] We've received a response to a heartbeat."))

      spark.on('readyStateChange', (state) => this.Log("[" + spark.id + "] readyStateChange : " + state))

      spark.on('end', () => {
        this.Log("[" + spark.id + "] Disconnected.")
        this.Log("Remaining " + this.primus.connected + " sparks.")
      })
    }, { port: 2121, transformer: 'engine.io'})

    this.Events()
  }

  Events () {
    this.primus.on('initialised', () => this.Log("Initialised."))

    this.primus.on('close', () => this.Log("The server has been destroyed."))

    this.primus.on('connection', () => {
      this.Log("We received a new connection.")
      this.Log("We have " + this.primus.connected + " sparks.")

      // this.primus.forEach((spark, next) => {
      //   console.log(spark.id)
      //   next()
      // }, (err) => {
      //   console.log('We are done');
      // })
    })

    this.primus.on('disconnection', () => this.Log("We received a disconnection."))

    this.primus.on('plugin', () => this.Log("A new plugin has been added."))

    this.primus.on('plugout', () => this.Log("A plugin has been removed."))

    this.primus.on('log', (data) => this.Log("Log : " + data))
  }

  Send (spark, data) {
    spark.write(AesCtr.encrypt(JSON.stringify(data), 'aZedç8s,;:ùx$w', 256))
  }

  Log (message) {
    console.log("[" + moment().format('LTS') + '][GameServer] ' + message)
  }
}
