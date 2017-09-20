class GameClient {

	constructor () {
    this.primus = new Primus('http://localhost:2121')

    this.primus.on("open", () => {
      this.Log("Connection opened !")
      this.Send({message: 'LoginRequested', id: 1, data: { key: '123456'}})
     })

    this.primus.on('data', (data) => this.Log('Data Received: ' + JSON.stringify(data)))

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
    this.primus.write(data)
  }

  Log (message) {
    console.log("[" + moment().format('LTS') + '][GameClient] ' + message)
  }
}
