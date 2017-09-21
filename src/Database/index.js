import Redis from 'redis'
import Bluebird from 'bluebird'
Bluebird.promisifyAll(Redis.RedisClient.prototype)
Bluebird.promisifyAll(Redis.Multi.prototype)

import AccountsDB from './AccountsDB'

export default class Database {
  constructor () {
    this.redis = Redis.createClient()
    this.accounts = new AccountsDB(this.redis)
  }
}
