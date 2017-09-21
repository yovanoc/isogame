export default class AccountsDB {

  constructor (redis) {
    this.redis = redis
  }

  get (username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.redis.existsAsync(`isogame.accounts.${username}`)
        var account = await this.redis.hgetallAsync(`isogame.accounts.${username}`)
        if (account === null) {
          reject('Account not found')
          return
        }

        if (account.password === password) {
          resolve(account)
        } else {
          reject('Wrong password')
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  delete (account) {
    return new Promise(async (resolve, reject) => {
      await this.redis.delAsync(`isogame.accounts.${account.username}`)
      await this.redis.sremAsync('isogame.accounts', `isogame.accounts.${account.username}`)
      resolve()
    })
  }

  set (account) {
    return new Promise(async (resolve, reject) => {
      account.money = Math.floor(Math.random() * (100 - 10) + 10)
      await this.redis.hmsetAsync(`isogame.accounts.${account.username}`, account)
      await this.redis.saddAsync('isogame.accounts', `isogame.accounts.${account.username}`)
      resolve(account)
    })
  }

  getAll () {
    return new Promise(async (resolve, reject) => {
      var accounts = []
      var members = await this.redis.smembersAsync('isogame.accounts')

      for (var i = 0; i < members.length; i++) {
        var account = await this.redis.hgetallAsync(members[i])
        accounts.push(account)
      }
      resolve(accounts)
    })
  }
}