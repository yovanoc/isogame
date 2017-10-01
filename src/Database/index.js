import Redis from 'redis'
import Bluebird from 'bluebird'
Bluebird.promisifyAll(Redis.RedisClient.prototype)
Bluebird.promisifyAll(Redis.Multi.prototype)

import AccountsRedis from './AccountsRedis'

export default class Database {
  constructor () {
    this.redis = Redis.createClient()
    this.accounts = new AccountsRedis(this.redis)
  }
}
