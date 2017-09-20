import Primus from 'primus'
import moment from 'moment'

export default class GameServer {
  constructor() {
    this.sparks = []

    this.primus = Primus.createServer((spark) => {
      console.log("[" + moment().format('LTS') + "][SERVER][" + spark.id + "] Connected.")

      this.AddSpark(spark)

      spark.on('data', (data) => {
        console.log("[" + moment().format('LTS') + "][SERVER][" + spark.id + "] Data : " + data)
        spark.write("SERVER DATA")
      })

      spark.on('error', (error) => {
        console.log("[" + moment().format('LTS') + "][SERVER][" + spark.id + "] Error : " + error)
      })

      spark.on('heartbeat', () => {
        console.log("[" + moment().format('LTS') + "][SERVER] We've received a response to a heartbeat.")
      })

      spark.on('readyStateChange', (state) => {
        console.log('[' + moment().format("LTS") + '][SERVER] readyStateChange: %s', state)
      })

      spark.on('end', () => {
        console.log("[" + moment().format('LTS') + "][SERVER][" + spark.id + "] Disconnected.")
        this.RemoveSpark(spark.id)
        console.log("Remaining " + this.sparks.length + " sparks.")
      })
    }, { port: 2121, transformer: 'engine.io'})

    this.Events()
  }

  GetSpark(sparkId) {
    return this.sparks.find(x => x.id === sparkId)
  }

  AddSpark(spark) {
    this.sparks.unshift(spark)
  }

  RemoveSpark(sparkId) {
    this.sparks.map((spark, index) => {
      if (spark.id === sparkId) {
        this.sparks.splice(index, 1)
        return
      }
    })
  }

  Events() {
    this.primus.on('initialised', () => {
      console.log("[" + moment().format('LTS') + "][SERVER] Initialised.")
    })

    this.primus.on('close', () => {
      console.log("[" + moment().format('LTS') + "][SERVER] The server has been destroyed.")
    })

    this.primus.on('connection', () => {
      console.log("[" + moment().format('LTS') + "][SERVER] We received a new connection.")
    })

    this.primus.on('disconnection', () => {
      console.log("[" + moment().format('LTS') + "][SERVER] We received a disconnection.")
    })

    this.primus.on('plugin', () => {
      console.log("[" + moment().format('LTS') + "][SERVER] A new plugin has been added.")
    })

    this.primus.on('plugout', () => {
      console.log("[" + moment().format('LTS') + "][SERVER] A plugin has been removed.")
    })

    this.primus.on('log', (data) => {
      console.log("[" + moment().format('LTS') + "][SERVER] Log: %s.", data)
    })
  }
}
