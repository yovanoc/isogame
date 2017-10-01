// Node.js core modules
import crypto from 'crypto';


/**
 * The encryption algorithm (cipher) type to be used.
 * @type {String}
 * @const
 * @private
 */
const CIPHER_ALGORITHM = 'aes-256-ctr';


//
// Primary API
//

/**
 * An API to allow for greatly simplified AES-256 encryption and decryption using a passphrase of
 * any length plus a random Initialization Vector.
 * @exports aes256
 * @public
 */
const aes256 = {

  /**
   * Encrypt a clear-text message using AES-256 plus a random Initialization Vector.
   * @param {String} key  A passphrase of any length to used to generate a symmetric session key.
   * @param {String} plaintext  The clear-text message to be encrypted.
   * @returns {String} A custom-encrypted version of the input.
   * @public
   * @method
   */
  encrypt(key, plaintext) {
    if (typeof key !== 'string' || !key) {
      throw new TypeError('Provided "key" must be a non-empty string');
    }
    if (typeof plaintext !== 'string' || !plaintext) {
      throw new TypeError('Provided "plaintext" must be a non-empty string');
    }

    const sha256 = crypto.createHash('sha256');
    sha256.update(key);

    // Initialization Vector
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);

    const ciphertext = cipher.update(new Buffer(plaintext));
    const encrypted = Buffer.concat([iv, ciphertext, cipher.final()]).toString('base64');

    return encrypted;
  },

  /**
   * Decrypt an encrypted message back to clear-text using AES-256 plus a random Initialization Vector.
   * @param {String} key  A passphrase of any length to used to generate a symmetric session key.
   * @param {String} encrypted  The encrypted message to be decrypted.
   * @returns {String} The original plain-text message.
   * @public
   * @method
   */
  decrypt(key, encrypted) {
    if (typeof key !== 'string' || !key) {
      throw new TypeError('Provided "key" must be a non-empty string');
    }
    if (typeof encrypted !== 'string' || !encrypted || encrypted.length < 17) {
      throw new TypeError('Provided "encrypted" must be a non-empty string');
    }

    const sha256 = crypto.createHash('sha256');
    sha256.update(key);

    const input = new Buffer(encrypted, 'base64');

    // Initialization Vector
    const iv = input.slice(0, 16);
    const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);

    const ciphertext = input.slice(16);
    const plaintext = decipher.update(ciphertext) + decipher.final();

    return plaintext;
  }

};




/**
 * Create a symmetric cipher with a given passphrase to then encrypt/decrypt data symmetrically.
 * @param {String} key  A passphrase of any length to used to generate a symmetric session key.
 * @protected
 * @constructor
 */
class AesCipher {
  constructor(key) {
    if (typeof key !== 'string' || !key) {
      throw new TypeError('Provided "key" must be a non-empty string');
    }

    /**
     * A passphrase of any length to used to generate a symmetric session key.
     * @member {String} key
     * @readonly
     */
    Object.defineProperty(this, 'key', { value: key });

  }

  /**
   * Encrypt a clear-text message using AES-256 plus a random Initialization Vector.
   * @param {String} plaintext  The clear-text message to be encrypted.
   * @returns {String} A custom-encrypted version of the input.
   * @protected
   * @method
   */
  encrypt(plaintext) {
    return aes256.encrypt(this.key, plaintext);
  }

  /**
   * Decrypt an encrypted message back to clear-text using AES-256 plus a random Initialization Vector.
   * @param {String} encrypted  The encrypted message to be decrypted.
   * @returns {String} The original plain-text message.
   * @protected
   * @method
   */
  decrypt(encrypted) {
    return aes256.decrypt(this.key, encrypted);
  }
}




//
// API Extension
//


/**
 * Create a symmetric cipher with a given passphrase to then encrypt/decrypt data symmetrically.
 * @param {String} key  A passphrase of any length to used to generate a symmetric session key.
 * @returns {AesCipher}
 * @public
 * @method
 */
aes256.createCipher = key => new AesCipher(key);




//
// Export the API
//

export default aes256;
