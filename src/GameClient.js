import Primus from 'primus'
import moment from 'moment'

export default class GameClient {

	constructor() {
    var Socket = Primus.createSocket({ transformer: 'engine.io' })
    this.primus = new Socket('http://localhost:2121')

    this.primus.on("open", () => {
      console.log('[' + moment().format("LTS") + '][GameClient] Connection opened !')
     })

    this.primus.on('data', (data) => {
      console.log('[' + moment().format("LTS") + '][GameClient] Data Received: ', data)
    })

    this.primus.on('error', (err) => {
      console.error('[' + moment().format("LTS") + '][GameClient] Something horrible has happened', err.stack)
    })

    this.primus.on('reconnect', (opts) => {
      console.log('[' + moment().format("LTS") + '][GameClient] Reconnection attempt started')
    })

    this.primus.on('reconnect scheduled', (opts) => {
      console.log('[' + moment().format("LTS") + '][GameClient] Reconnecting in %d ms', opts.scheduled)
      console.log('[' + moment().format("LTS") + '][GameClient] This is attempt %d out of %d', opts.attempt, opts.retries)
    })

    this.primus.on('reconnected', (opts) => {
      console.log('[' + moment().format("LTS") + '][GameClient] It took %d ms to reconnect', opts.duration)
    })

    this.primus.on('reconnect timeout', (err, opts) => {
      console.log('[' + moment().format("LTS") + '][GameClient] Timeout expired: %s', err.message)
    })

    this.primus.on('timeout', () => {
      console.log('[' + moment().format("LTS") + '][GameClient] Connection timeout.')
    })

    this.primus.on('reconnect failed', (err, opts) => {
      console.log('[' + moment().format("LTS") + '][GameClient] The reconnection failed: %s', err.message)
    })

    this.primus.on('end', () => {
      console.log('[' + moment().format("LTS") + '][GameClient] Connection ended.')
    })

    this.primus.on('close', () => {
      console.log('[' + moment().format("LTS") + '][GameClient] Connection closed.')
    })

    this.primus.on('destroy', () => {
      console.log('[' + moment().format("LTS") + '][GameClient] Feel the power of my lasers!')
    })

    this.primus.on('online', () => {
      console.log('[' + moment().format("LTS") + '][GameClient] We\'ve regained a network connection.')
    })

    this.primus.on('offline', () => {
      console.log('[' + moment().format("LTS") + '][GameClient] We\'ve lost our internet connection.')
    })

    this.primus.on('readyStateChange', (state) => {
      console.log('[' + moment().format("LTS") + '][GameClient] readyStateChange: %s', state)
    })
	}

	Start() {
		this.primus.open()
	}

	Stop() {
		this.primus.end()
	}

	Send(data) {
		this.primus.write(data)
	}
}
