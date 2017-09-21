'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _primus=require('primus');var _primus2=_interopRequireDefault(_primus);var _moment=require('moment');var _moment2=_interopRequireDefault(_moment);var _AesCtr=require('../Utility/Aes/AesCtr');var _AesCtr2=_interopRequireDefault(_AesCtr);var _Dispatcher=require('../Utility/Dispatcher');var _Dispatcher2=_interopRequireDefault(_Dispatcher);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var Client=function(){function Client(){var _this=this;_classCallCheck(this,Client);this.secret='aZed\xE78s,;:\xF9x$w';this.dispatcher=new _Dispatcher2.default;var Socket=_primus2.default.createSocket({transformer:'engine.io'});this.primus=new Socket('http://localhost:2121');this.primus.on('open',function(){_this.log('Connection opened !');_this.dispatcher.emit('connected')});this.primus.on('data',function(data){// this.log('Plain data: ' + data)
var decryptedData=_AesCtr2.default.decrypt(data,_this.secret,256);var parsedMessage=JSON.parse(decryptedData);// this.log('Data Received: #' + parsedMessage.id)
_this.dispatcher.emit(parsedMessage.message,_this,parsedMessage)});this.primus.on('error',function(err){console.error('['+(0,_moment2.default)().format('LTS')+'][Client] Something horrible has happened',err.stack)});this.primus.on('reconnect',function(opts){return _this.log('Reconnection attempt started')});this.primus.on('reconnect scheduled',function(opts){_this.log('Reconnecting in '+opts.scheduled+' ms');_this.log('This is attempt '+opts.attempt+' out of '+opts.retries)});this.primus.on('reconnected',function(opts){return _this.log('It took '+opts.duration+' ms to reconnect')});this.primus.on('reconnect timeout',function(err,opts){return _this.log('Timeout expired : '+err.message)});this.primus.on('timeout',function(){return _this.log('Connection timeout.')});this.primus.on('reconnect failed',function(err,opts){return _this.log('The reconnection failed : '+err.message)});this.primus.on('end',function(){return _this.log('Connection ended.')});this.primus.on('close',function(){return _this.log('Connection closed.')});this.primus.on('destroy',function(){return _this.log('Feel the power of my lasers!')});this.primus.on('online',function(){return _this.log('We\'ve regained a network connection.')});this.primus.on('offline',function(){return _this.log('We\'ve lost our internet connection.')});this.primus.on('readyStateChange',function(state){return _this.log('readyStateChange : '+state)})}_createClass(Client,[{key:'getId',value:function getId(){return this.primus.id(function(id){return id})}},{key:'start',value:function start(){this.primus.open()}},{key:'stop',value:function stop(){this.primus.end()}},{key:'send',value:function send(data){this.primus.write(_AesCtr2.default.encrypt(JSON.stringify(data),this.secret,256))}},{key:'log',value:function log(message){console.log('['+(0,_moment2.default)().format('LTS')+'][Client] '+message)}}]);return Client}();exports.default=Client;