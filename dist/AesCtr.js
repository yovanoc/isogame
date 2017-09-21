/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *//* AES counter-mode (CTR) implementation in JavaScript                (c) Chris Veness 2005-2017  *//*                                                                                   MIT Licence  *//* www.movable-type.co.uk/scripts/aes.html                                                        *//* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *//* global WorkerGlobalScope */'use strict';// const Aes = require('./aes.js'); // ≡ import Aes from 'aes.js'; uncomment to use in Node.js
var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _Aes2=require('./Aes.js');var _Aes3=_interopRequireDefault(_Aes2);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}/**
 * AesCtr: Counter-mode (CTR) wrapper for AES.
 *
 * This encrypts a Unicode string to produces a base64 ciphertext using 128/192/256-bit AES,
 * and the converse to decrypt an encrypted ciphertext.
 *
 * See csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
 */var AesCtr=function(_Aes){_inherits(AesCtr,_Aes);function AesCtr(){_classCallCheck(this,AesCtr);return _possibleConstructorReturn(this,(AesCtr.__proto__||Object.getPrototypeOf(AesCtr)).apply(this,arguments))}_createClass(AesCtr,null,[{key:'encrypt',/**
     * Encrypt a text using AES encryption in Counter mode of operation.
     *
     * Unicode multi-byte character safe
     *
     * @param   {string} plaintext - Source text to be encrypted.
     * @param   {string} password - The password to use to generate a key for encryption.
     * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
     * @returns {string} Encrypted text.
     *
     * @example
     *   const encr = AesCtr.encrypt('big secret', 'pāşšŵōřđ', 256); // 'lwGl66VVwVObKIr6of8HVqJr'
     */value:function encrypt(plaintext,password,nBits){var blockSize=16;// block size fixed at 16 bytes / 128 bits (Nb=4) for AES
if(!(nBits==128||nBits==192||nBits==256))throw new Error('Key size is not 128 / 192 / 256');plaintext=AesCtr.utf8Encode(String(plaintext));password=AesCtr.utf8Encode(String(password));// use AES itself to encrypt password to get cipher key (using plain password as source for key
// expansion) to give us well encrypted key (in real use hashed password could be used for key)
var nBytes=nBits/8;// no bytes in key (16/24/32)
var pwBytes=new Array(nBytes);for(var i=0;i<nBytes;i++){// use 1st 16/24/32 chars of password for key
pwBytes[i]=i<password.length?password.charCodeAt(i):0}var key=_Aes3.default.cipher(pwBytes,_Aes3.default.keyExpansion(pwBytes));// gives us 16-byte key
key=key.concat(key.slice(0,nBytes-16));// expand key to 16/24/32 bytes long
// initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec,
// [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
var counterBlock=new Array(blockSize);var nonce=new Date().getTime();// timestamp: milliseconds since 1-Jan-1970
var nonceMs=nonce%1000;var nonceSec=Math.floor(nonce/1000);var nonceRnd=Math.floor(Math.random()*65535);// for debugging: nonce = nonceMs = nonceSec = nonceRnd = 0;
for(var _i=0;_i<2;_i++){counterBlock[_i]=nonceMs>>>_i*8&255}for(var _i2=0;_i2<2;_i2++){counterBlock[_i2+2]=nonceRnd>>>_i2*8&255}for(var _i3=0;_i3<4;_i3++){counterBlock[_i3+4]=nonceSec>>>_i3*8&255}// and convert it to a string to go on the front of the ciphertext
var ctrTxt='';for(var _i4=0;_i4<8;_i4++){ctrTxt+=String.fromCharCode(counterBlock[_i4])}// generate key schedule - an expansion of the key into distinct Key Rounds for each round
var keySchedule=_Aes3.default.keyExpansion(key);var blockCount=Math.ceil(plaintext.length/blockSize);var ciphertext='';for(var b=0;b<blockCount;b++){// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
// done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
for(var c=0;c<4;c++){counterBlock[15-c]=b>>>c*8&255}for(var _c=0;_c<4;_c++){counterBlock[15-_c-4]=b/4294967296>>>_c*8}var cipherCntr=_Aes3.default.cipher(counterBlock,keySchedule);// -- encrypt counter block --
// block size is reduced on final block
var blockLength=b<blockCount-1?blockSize:(plaintext.length-1)%blockSize+1;var cipherChar=new Array(blockLength);for(var _i5=0;_i5<blockLength;_i5++){// -- xor plaintext with ciphered counter char-by-char --
cipherChar[_i5]=cipherCntr[_i5]^plaintext.charCodeAt(b*blockSize+_i5);cipherChar[_i5]=String.fromCharCode(cipherChar[_i5])}ciphertext+=cipherChar.join('');// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
if(typeof WorkerGlobalScope!='undefined'&&self instanceof WorkerGlobalScope){if(b%1000==0)self.postMessage({progress:b/blockCount})}}ciphertext=AesCtr.base64Encode(ctrTxt+ciphertext);return ciphertext}/**
     * Decrypt a text encrypted by AES in counter mode of operation
     *
     * @param   {string} ciphertext - Cipher text to be decrypted.
     * @param   {string} password - Password to use to generate a key for decryption.
     * @param   {number} nBits - Number of bits to be used in the key; 128 / 192 / 256.
     * @returns {string} Decrypted text
     *
     * @example
     *   const decr = AesCtr.decrypt('lwGl66VVwVObKIr6of8HVqJr', 'pāşšŵōřđ', 256); // 'big secret'
     */},{key:'decrypt',value:function decrypt(ciphertext,password,nBits){var blockSize=16;// block size fixed at 16 bytes / 128 bits (Nb=4) for AES
if(!(nBits==128||nBits==192||nBits==256))throw new Error('Key size is not 128 / 192 / 256');ciphertext=AesCtr.base64Decode(String(ciphertext));password=AesCtr.utf8Encode(String(password));// use AES to encrypt password (mirroring encrypt routine)
var nBytes=nBits/8;// no bytes in key
var pwBytes=new Array(nBytes);for(var i=0;i<nBytes;i++){// use 1st nBytes chars of password for key
pwBytes[i]=i<password.length?password.charCodeAt(i):0}var key=_Aes3.default.cipher(pwBytes,_Aes3.default.keyExpansion(pwBytes));key=key.concat(key.slice(0,nBytes-16));// expand key to 16/24/32 bytes long
// recover nonce from 1st 8 bytes of ciphertext
var counterBlock=new Array(8);var ctrTxt=ciphertext.slice(0,8);for(var _i6=0;_i6<8;_i6++){counterBlock[_i6]=ctrTxt.charCodeAt(_i6)}// generate key schedule
var keySchedule=_Aes3.default.keyExpansion(key);// separate ciphertext into blocks (skipping past initial 8 bytes)
var nBlocks=Math.ceil((ciphertext.length-8)/blockSize);var ct=new Array(nBlocks);for(var b=0;b<nBlocks;b++){ct[b]=ciphertext.slice(8+b*blockSize,8+b*blockSize+blockSize)}ciphertext=ct;// ciphertext is now array of block-length strings
// plaintext will get generated block-by-block into array of block-length strings
var plaintext='';for(var _b=0;_b<nBlocks;_b++){// set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
for(var c=0;c<4;c++){counterBlock[15-c]=_b>>>c*8&255}for(var _c2=0;_c2<4;_c2++){counterBlock[15-_c2-4]=(_b+1)/4294967296-1>>>_c2*8&255}var cipherCntr=_Aes3.default.cipher(counterBlock,keySchedule);// encrypt counter block
var plaintxtByte=new Array(ciphertext[_b].length);for(var _i7=0;_i7<ciphertext[_b].length;_i7++){// -- xor plaintext with ciphered counter byte-by-byte --
plaintxtByte[_i7]=cipherCntr[_i7]^ciphertext[_b].charCodeAt(_i7);plaintxtByte[_i7]=String.fromCharCode(plaintxtByte[_i7])}plaintext+=plaintxtByte.join('');// if within web worker, announce progress every 1000 blocks (roughly every 50ms)
if(typeof WorkerGlobalScope!='undefined'&&self instanceof WorkerGlobalScope){if(_b%1000==0)self.postMessage({progress:_b/nBlocks})}}plaintext=AesCtr.utf8Decode(plaintext);// decode from UTF8 back to Unicode multi-byte chars
return plaintext}/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *//**
     * Encodes multi-byte string to utf8.
     *
     * Note utf8Encode is an identity function with 7-bit ascii strings, but not with 8-bit strings;
     * utf8Encode('x') = 'x', but utf8Encode('ça') = 'Ã§a', and utf8Encode('Ã§a') = 'ÃÂ§a'.
     */},{key:'utf8Encode',value:function utf8Encode(str){try{return new TextEncoder().encode(str,'utf-8').reduce(function(prev,curr){return prev+String.fromCharCode(curr)},'')}catch(e){// no TextEncoder available?
return unescape(encodeURIComponent(str));// monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
}}/**
     * Decodes utf8 string to multi-byte.
     */},{key:'utf8Decode',value:function utf8Decode(str){try{return new TextEncoder().decode(str,'utf-8').reduce(function(prev,curr){return prev+String.fromCharCode(curr)},'')}catch(e){// no TextEncoder available?
return decodeURIComponent(escape(str));// monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
}}/*
     * Encodes string as base-64.
     *
     * - developer.mozilla.org/en-US/docs/Web/API/window.btoa, nodejs.org/api/buffer.html
     * - note: btoa & Buffer/binary work on single-byte Unicode (C0/C1), so ok for utf8 strings, not for general Unicode...
     * - note: if btoa()/atob() are not available (eg IE9-), try github.com/davidchambers/Base64.js
     */},{key:'base64Encode',value:function base64Encode(str){if(typeof btoa!='undefined')return btoa(str);// browser
if(typeof Buffer!='undefined')return new Buffer(str,'binary').toString('base64');// Node.js
throw new Error('No Base64 Encode')}/*
     * Decodes base-64 encoded string.
     */},{key:'base64Decode',value:function base64Decode(str){if(typeof atob!='undefined')return atob(str);// browser
if(typeof Buffer!='undefined')return new Buffer(str,'base64').toString('binary');// Node.js
throw new Error('No Base64 Decode')}}]);return AesCtr}(_Aes3.default);/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */module.exports=AesCtr;// uncomment to use in Node.js