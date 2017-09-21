'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step('next',value)},function(err){step('throw',err)})}}return step('next')})}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var AccountsDB=function(){function AccountsDB(redis){_classCallCheck(this,AccountsDB);this.redis=redis}_createClass(AccountsDB,[{key:'get',value:function get(username,password){var _this=this;return new Promise(function(){var _ref=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve,reject){var account;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;_context.next=3;return _this.redis.existsAsync('isogame.accounts.'+username);case 3:_context.next=5;return _this.redis.hgetallAsync('isogame.accounts.'+username);case 5:account=_context.sent;if(!(account===null)){_context.next=9;break}reject('Account not found');return _context.abrupt('return');case 9:if(account.password===password){resolve(account)}else{reject('Wrong password')}_context.next=15;break;case 12:_context.prev=12;_context.t0=_context['catch'](0);reject(_context.t0);case 15:case'end':return _context.stop();}}},_callee,_this,[[0,12]])}));return function(_x,_x2){return _ref.apply(this,arguments)}}())}},{key:'delete',value:function _delete(account){var _this2=this;return new Promise(function(){var _ref2=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve,reject){return regeneratorRuntime.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return _this2.redis.delAsync('isogame.accounts.'+account.username);case 2:_context2.next=4;return _this2.redis.sremAsync('isogame.accounts','isogame.accounts.'+account.username);case 4:resolve();case 5:case'end':return _context2.stop();}}},_callee2,_this2)}));return function(_x3,_x4){return _ref2.apply(this,arguments)}}())}},{key:'set',value:function set(account){var _this3=this;return new Promise(function(){var _ref3=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve,reject){return regeneratorRuntime.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:account.money=Math.floor(Math.random()*(100-10)+10);_context3.next=3;return _this3.redis.hmsetAsync('isogame.accounts.'+account.username,account);case 3:_context3.next=5;return _this3.redis.saddAsync('isogame.accounts','isogame.accounts.'+account.username);case 5:resolve(account);case 6:case'end':return _context3.stop();}}},_callee3,_this3)}));return function(_x5,_x6){return _ref3.apply(this,arguments)}}())}},{key:'getAll',value:function getAll(){var _this4=this;return new Promise(function(){var _ref4=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee4(resolve,reject){var accounts,members,i,account;return regeneratorRuntime.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:accounts=[];_context4.next=3;return _this4.redis.smembersAsync('isogame.accounts');case 3:members=_context4.sent;i=0;case 5:if(!(i<members.length)){_context4.next=13;break}_context4.next=8;return _this4.redis.hgetallAsync(members[i]);case 8:account=_context4.sent;accounts.push(account);case 10:i++;_context4.next=5;break;case 13:resolve(accounts);case 14:case'end':return _context4.stop();}}},_callee4,_this4)}));return function(_x7,_x8){return _ref4.apply(this,arguments)}}())}}]);return AccountsDB}();exports.default=AccountsDB;