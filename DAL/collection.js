'use strict';

import { MongoClient } from 'mongodb';

export default async function(tableName) {
  const url = process.env.MONGO_URL;
  try {
    const client = await MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
    const db = client.db('wishlists');
    return {
      collection: db.collection(tableName),
      client: client,
    };
  } catch (error) {
    console.log('Can\'t connect to the mongo database hosted at ' + url);
    console.log(error);
  }
};
