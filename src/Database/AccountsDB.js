export default class AccountsDB {

  constructor (redis) {
    this.redis = redis
    this.table = 'isogame.accounts'
  }

  get (username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        var exists = await this.redis.existsAsync(`${this.table}.${username}`)
        if (exists) {
          var account = await this.redis.hgetallAsync(`${this.table}.${username}`)

          if (account.password === password) {
            resolve(account)
          } else {
            reject('Wrong password')
          }
        } else {
          reject('Account not found')
        }

      } catch (e) {
        reject(e)
      }
    })
  }

  delete (account) {
    return new Promise(async (resolve, reject) => {
      await this.redis.delAsync(`${this.table}.${account.username}`)
      await this.redis.sremAsync(`${this.table}`, `${this.table}.${account.username}`)
      resolve()
    })
  }

  set (account) {
    return new Promise(async (resolve, reject) => {
      account.money = Math.floor(Math.random() * (100 - 10) + 10)
      await this.redis.hmsetAsync(`${this.table}.${account.username}`, account)
      await this.redis.saddAsync(`${this.table}`, `${this.table}.${account.username}`)
      resolve(account)
    })
  }

  getAll () {
    return new Promise(async (resolve, reject) => {
      var accounts = []
      var members = await this.redis.smembersAsync(`${this.table}`)

      for (var i = 0; i < members.length; i++) {
        var account = await this.redis.hgetallAsync(members[i])
        accounts.push(account)
      }
      resolve(accounts)
    })
  }
}
