const { MongoClient, ObjectId, Db } = require('mongodb');
const { MONGO_URL, DB_NAME } = require('../variables');

function citrculationRepo() {
  function get(query, limit) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        let items = db.collection('newspapers').find(query);
        if (limit > 0) {
          items = items.limit(limit);
        }
        res(await items.toArray());
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  function getById(id) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const item = await db.collection('newspapers').findOne(new ObjectId(id));
        res(item);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  function add(item) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const addedItem = await db.collection('newspapers').insertOne(item);
        res(addedItem);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  function loadData(data) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const results = await db.collection('newspapers').insertMany(data);
        res(results);
        client.close();
      } catch (error) {}
    });
  }

  return { loadData, get, getById, add };
}

module.exports = citrculationRepo();
