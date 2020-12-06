'use strict';

import pkg from 'mongodb';
import TableCall from './tableCall.js';

const { ObjectID } = pkg;
const tcInstance = new TableCall('users');

export const findByEmail = function(email) {
  return tcInstance.call((collection) => {
    return collection.findOne({ email: email });
  });
};

export const findById =function(id) {
  return tcInstance.call((collection) => {
    return collection.findOne({ _id: new ObjectID(id) });
  });
};

export const saveUser = function(email, hash) {
  return tcInstance.call((collection) => {
    return collection.insertOne(
        { email: email, password: hash, verified: false });
  });
};

export const updateUser = function(query, where) {
  return tcInstance.call((collection) => {
    return collection.updateOne(query, { $set: where });
  });
};
