const { MongoClient, ObjectId, Db } = require('mongodb');
const { MONGO_URL, DB_NAME } = require('../variables');

function citrculationRepo() {
  // const client = new MongoClient(MONGO_URL);
  // const db = client.db(DB_NAME);

  function loadData(data) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const results = await db.collection('newspapers').insertMany(data);
        res(results);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

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

  function update(id, newItem) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const updatedItem = await db
          .collection('newspapers')
          .findOneAndReplace({ _id: new ObjectId(id) }, newItem, { returnDocument: 'after' });
        res(updatedItem.value);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  function remove(id) {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const removed = await db.collection('newspapers').deleteOne({ _id: new ObjectId(id) });
        res(removed.deletedCount === 1);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  function averageFinalists() {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const average = await db
          .collection('newspapers')
          .aggregate([
            {
              $group: {
                _id: null,
                avgFinalists: { $avg: '$Pulitzer Prize Winners and Finalists, 1990-2014' },
              },
            },
          ])
          .toArray();

        res(average[0].avgFinalists);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  function averageFinalistsByChange() {
    return new Promise(async (res, rej) => {
      const client = new MongoClient(MONGO_URL);
      try {
        await client.connect();
        const db = client.db(DB_NAME);
        const average = await db
          .collection('newspapers')
          .aggregate([
            {
              $project: {
                'Newspaper': 1,
                'Pulitzer Prize Winners and Finalists, 2004-2014': 1,
                'Change in Daily Circulation, 2004-2013': 1,
                overallChange: {
                  $cond: {
                    if: { $gte: ['$Change in Daily Circulation, 2004-2013', 0] },
                    then: 'positive',
                    else: 'negative',
                  },
                },
              },
            },
            {
              $group: {
                _id: '$overallChange',
                avgFinalists: { $avg: '$Pulitzer Prize Winners and Finalists, 2004-2014' },
              },
            },
          ])
          .toArray();

        res(average);
        client.close();
      } catch (error) {
        rej(error);
      }
    });
  }

  return { loadData, get, getById, add, update, remove, averageFinalists, averageFinalistsByChange };
}

module.exports = citrculationRepo();
