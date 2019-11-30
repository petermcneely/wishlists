'use strict';

const mongodb = require('mongodb');
const TableCall = require('./tableCall');

const tcInstance = new TableCall('users');

const findByEmail = function(email) {
  return tcInstance.call((collection) => {
    return collection.findOne({email: email});
  });
};

const findById =function(id) {
  return tcInstance.call((collection) => {
    return collection.findOne({_id: new mongodb.ObjectID(id)});
  });
};

const saveUser = function(email, hash) {
  return tcInstance.call((collection) => {
    return collection.insertOne(
        {email: email, password: hash, verified: false});
  });
};

const updateUser = function(query, where) {
  return tcInstance.call((collection) => {
    return collection.updateOne(query, {$set: where});
  });
};

module.exports = {
  findByEmail: findByEmail,
  findById: findById,
  saveUser: saveUser,
  updateUser: updateUser,
}
;
