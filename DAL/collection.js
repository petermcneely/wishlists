'use strict';

import pkg from 'mongodb';

const { MongoClient } = pkg;

export default async function(tableName) {
  const url = process.env.MONGO_URL;
  try {
    const client = await MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
    const db = client.db('wishlists');
    return {
      collection: db.collection(tableName),
      client: client,
    };
  } catch (error) {
    console.error(`Cannot connect to the mongo database hosted at ${url}`);
    console.error(error);
  }
};
