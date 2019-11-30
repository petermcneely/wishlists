'use strict';

const dal = require('../DAL/users');
const bcrypt = require('bcrypt');
const crypto = require('crypto-promise');
const checkPassword = require('../utils/passwordChecker');

module.exports = class UsersService {
  /**
   * Creates a new UserService
   */
  constructor() {
    this.checkPassword = function(password) {
      return checkPassword(password);
    };
  }

  /**
  * Finds the user by the email
  * @param {string} email The email
  * @return {Promise}
  */
  findByEmail(email) {
    return dal.findByEmail(email);
  }

  /**
  * Finds the user by the id
  * @param {int} id The id
  * @return {Promise}
  */
  findById(id) {
    return dal.findById(id);
  }

  /**
   * Creates the user
   * @param {string} email The user's email
   * @param {string} password The user's password
   * @param {string} retypePassword The user's retyped password
   * @return {Promise}
   */
  createUser(email, password, retypePassword) {
    if (password !== retypePassword) {
      return Promise.resolve({message: 'Passwords do not match.'});
    }

    const message = this.checkPassword(password);
    if (message) {
      return Promise.resolve({message: message});
    } else {
      return dal.findByEmail(email).then((user) => {
        if (user) {
          return Promise.resolve(
              {message: 'A user with that email already exists.'});
        } else {
          return this.hashPassword(password).then((hash) => {
            return dal.saveUser(email, hash).then((result) => {
              return result.insertedId;
            });
          });
        }
      });
    }
  }

  /**
   * Hashes the provided password
   * @param {string} password The password to hash
   * @return {string}
   */
  hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  /**
   * @param {string} email the email to encrypt
   * @return {string}
   */
  encryptVerificationParameters(email) {
    return crypto.cipher('aes256', process.env.CRYPTO_SECRET)(email);
  }

  /**
   * @param {string} encrypted the encrypted string
   * @return {string}
   */
  decryptVerificationParameters(encrypted) {
    return crypto.decipher(
        'aes256', process.env.CRYPTO_SECRET)(encrypted, 'hex');
  }

  /**
   * Updates the email's password with a new one.
   * Returns the new password.
   * @param {string} email the email associated with the password reset
   * @return {string}
   */
  overwritePassword(email) {
    const passwordGenerator = require('generate-password');
    const newPassword = passwordGenerator.generate(
        {length: 12, numbers: true, uppercase: true, strict: true});
    return this.hashPassword(newPassword).then((hash) => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return dal.updateUser(
          {email: email}, {password: hash, passwordExpiry: date}).then(() => {
        return newPassword;
      });
    });
  }

  /**
   * Changes the password for a user
   * @param {string} newPassword new password
   * @param {string} newRetypePassword new re-typed password
   * @param {int} userId the id of the user owning the password
   * @return {Promise}
   */
  changePassword(newPassword, newRetypePassword, userId) {
    if (newPassword !== newRetypePassword) {
      return Promise.resolve({message: 'Passwords do not match.'});
    }

    const message = this.checkPassword(newPassword);
    if (message) {
      return Promise.resolve({message: message});
    } else {
      return this.hashPassword(newPassword).then((hash) => {
        return dal.updateUser(
            {_id: userId}, {password: hash, passwordExpiry: null});
      });
    }
  }

  /**
   * Change the user's email to the passed in one
   * @param {string} email the email
   * @param {string} userId the id of the user
   * @return {Promise}
   */
  changeEmail(email, userId) {
    return dal.updateUser({_id: userId}, {email: email});
  }

  /**
   * @param {string} token the token to decrypt
   * @return {Promise}
   */
  verify(token) {
    return this.decryptVerificationParameters(token).then((email) => {
      if (email.toString()) {
        return dal.updateUser({email: email.toString()}, {verified: true});
      } else {
        return Promise.reject(new Error('No valid token was sent to verify.'));
      }
    });
  }
}
;
