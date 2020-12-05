'use strict';

import collection from './collection';

export default class TableCall {
  /**
   * @param {string} tableName The name of the table to call.
   */
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * @param {function} cb The action to perform on the table
   * @return {object} result of the action.
   */
  call(cb) {
    this.client = null;
    return collection(this.tableName).then((obj) => {
      this.client = obj.client;
      return cb(obj.collection).then((result) => {
        if (this.client) {
          this.client.close();
        } else {
          console.log('No client?');
        }
        return result;
      }).catch((e) => {
        console.log(e);
        if (this.client) this.client.close();
        return Promise.reject(e);
      });
    });
  }
}
;
