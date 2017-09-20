import 'babel-polyfill'
import GameServer from './GameServer'
import Redis from 'redis'

var server = new GameServer()

// var redis = Redis.createClient();
//
// redis.on('connect', () => console.log('connected'))
// redis.on('error', (error) => console.log(error.message))
