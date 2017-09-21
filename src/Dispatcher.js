export default class Dispatcher {

  constructor () {
    this._prefix = 'on_'
    this.listeners = {}
  }

  register (eventName, callback, bind) {
    const _eventName = this._prefix + eventName
    if (typeof this.listeners[_eventName] === 'undefined') {
      this.listeners[_eventName] = []
    }
    this.listeners[_eventName].push([bind === null ? this : bind, callback])
  }

  emit (eventName, ...params) {
    const _eventName = this._prefix + eventName
    if (typeof this.listeners[_eventName] !== 'undefined') {
      for (let i = 0, l = this.listeners[_eventName].length; i < l; i++) {
        this.listeners[_eventName][i][1].call(this.listeners[_eventName][i][0], ...params)
      }
    }
  }
}
