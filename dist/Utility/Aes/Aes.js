/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *//* AES implementation in JavaScript                                   (c) Chris Veness 2005-2017  *//*                                                                                   MIT Licence  *//* www.movable-type.co.uk/scripts/aes.html                                                        *//* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */'use strict';/**
 * AES (Rijndael cipher) encryption routines reference implementation,
 *
 * This is an annotated direct implementation of FIPS 197, without any optimisations. It is
 * intended to aid understanding of the algorithm rather than for production use.
 *
 * While it could be used where performance is not critical, I would recommend using the ‘Web
 * Cryptography API’ (developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt) for the browser,
 * or the ‘crypto’ library (nodejs.org/api/crypto.html#crypto_class_cipher) in Node.js.
 *
 * See csrc.nist.gov/publications/fips/fips197/fips-197.pdf
 */var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var Aes=function(){function Aes(){_classCallCheck(this,Aes)}_createClass(Aes,null,[{key:'cipher',/**
     * AES Cipher function: encrypt 'input' state with Rijndael algorithm [§5.1];
     *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage.
     *
     * @param   {number[]}   input - 16-byte (128-bit) input state array.
     * @param   {number[][]} w - Key schedule as 2D byte-array (Nr+1 × Nb bytes).
     * @returns {number[]}   Encrypted output state array.
     */value:function cipher(input,w){var Nb=4;// block size (in words): no of columns in state (fixed at 4 for AES)
var Nr=w.length/Nb-1;// no of rounds: 10/12/14 for 128/192/256-bit keys
var state=[[],[],[],[]];// initialise 4×Nb byte-array 'state' with input [§3.4]
for(var i=0;i<4*Nb;i++){state[i%4][Math.floor(i/4)]=input[i]}state=Aes.addRoundKey(state,w,0,Nb);for(var round=1;round<Nr;round++){state=Aes.subBytes(state,Nb);state=Aes.shiftRows(state,Nb);state=Aes.mixColumns(state,Nb);state=Aes.addRoundKey(state,w,round,Nb)}state=Aes.subBytes(state,Nb);state=Aes.shiftRows(state,Nb);state=Aes.addRoundKey(state,w,Nr,Nb);var output=new Array(4*Nb);// convert state to 1-d array before returning [§3.4]
for(var _i=0;_i<4*Nb;_i++){output[_i]=state[_i%4][Math.floor(_i/4)]}return output}/**
     * Perform key expansion to generate a key schedule from a cipher key [§5.2].
     *
     * @param   {number[]}   key - Cipher key as 16/24/32-byte array.
     * @returns {number[][]} Expanded key schedule as 2D byte-array (Nr+1 × Nb bytes).
     */},{key:'keyExpansion',value:function keyExpansion(key){var Nb=4;// block size (in words): no of columns in state (fixed at 4 for AES)
var Nk=key.length/4;// key length (in words): 4/6/8 for 128/192/256-bit keys
var Nr=Nk+6;// no of rounds: 10/12/14 for 128/192/256-bit keys
var w=new Array(Nb*(Nr+1));var temp=new Array(4);// initialise first Nk words of expanded key with cipher key
for(var i=0;i<Nk;i++){var r=[key[4*i],key[4*i+1],key[4*i+2],key[4*i+3]];w[i]=r}// expand the key into the remainder of the schedule
for(var _i2=Nk;_i2<Nb*(Nr+1);_i2++){w[_i2]=new Array(4);for(var t=0;t<4;t++){temp[t]=w[_i2-1][t]}// each Nk'th word has extra transformation
if(_i2%Nk==0){temp=Aes.subWord(Aes.rotWord(temp));for(var _t=0;_t<4;_t++){temp[_t]^=Aes.rCon[_i2/Nk][_t]}}// 256-bit key has subWord applied every 4th word
else if(Nk>6&&_i2%Nk==4){temp=Aes.subWord(temp)}// xor w[i] with w[i-1] and w[i-Nk]
for(var _t2=0;_t2<4;_t2++){w[_i2][_t2]=w[_i2-Nk][_t2]^temp[_t2]}}return w}/**
     * Apply SBox to state S [§5.1.1].
     *
     * @private
     */},{key:'subBytes',value:function subBytes(s,Nb){for(var r=0;r<4;r++){for(var c=0;c<Nb;c++){s[r][c]=Aes.sBox[s[r][c]]}}return s}/**
     * Shift row r of state S left by r bytes [§5.1.2].
     *
     * @private
     */},{key:'shiftRows',value:function shiftRows(s,Nb){var t=new Array(4);for(var r=1;r<4;r++){for(var c=0;c<4;c++){t[c]=s[r][(c+r)%Nb]}// shift into temp copy
for(var _c=0;_c<4;_c++){s[r][_c]=t[_c]}// and copy back
}// note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
return s;// see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
}/**
     * Combine bytes of each col of state S [§5.1.3].
     *
     * @private
     */},{key:'mixColumns',value:function mixColumns(s,Nb){for(var c=0;c<Nb;c++){var a=new Array(Nb);// 'a' is a copy of the current column from 's'
var b=new Array(Nb);// 'b' is a•{02} in GF(2^8)
for(var r=0;r<4;r++){a[r]=s[r][c];b[r]=s[r][c]&128?s[r][c]<<1^283:s[r][c]<<1}// a[n] ^ b[n] is a•{03} in GF(2^8)
s[0][c]=b[0]^a[1]^b[1]^a[2]^a[3];// {02}•a0 + {03}•a1 + a2 + a3
s[1][c]=a[0]^b[1]^a[2]^b[2]^a[3];// a0 • {02}•a1 + {03}•a2 + a3
s[2][c]=a[0]^a[1]^b[2]^a[3]^b[3];// a0 + a1 + {02}•a2 + {03}•a3
s[3][c]=a[0]^b[0]^a[1]^a[2]^b[3];// {03}•a0 + a1 + a2 + {02}•a3
}return s}/**
     * Xor Round Key into state S [§5.1.4].
     *
     * @private
     */},{key:'addRoundKey',value:function addRoundKey(state,w,rnd,Nb){for(var r=0;r<4;r++){for(var c=0;c<Nb;c++){state[r][c]^=w[rnd*4+c][r]}}return state}/**
     * Apply SBox to 4-byte word w.
     *
     * @private
     */},{key:'subWord',value:function subWord(w){for(var i=0;i<4;i++){w[i]=Aes.sBox[w[i]]}return w}/**
     * Rotate 4-byte word w left by one byte.
     *
     * @private
     */},{key:'rotWord',value:function rotWord(w){var tmp=w[0];for(var i=0;i<3;i++){w[i]=w[i+1]}w[3]=tmp;return w}}]);return Aes}();// sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22];// rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]];/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */module.exports=Aes;// ≡ export default Aes; uncomment to use in Node.js