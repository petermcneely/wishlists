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
  async call(cb) {
    try {
      this.client = null;
      const obj = await collection(this.tableName);
      this.client = obj.client;
      const result = await cb(obj.collection);

      if (this.client) {
        this.client.close();
      } else {
        console.log('No client?');
      }
      return result;
    } catch (e) {
      console.log(e);
      if (this.client) this.client.close();
      throw e;
    }
  }
}
;
