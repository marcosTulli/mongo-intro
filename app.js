const { MONGO_URL, DB_NAME } = require('./variables');
const assert = require('assert');
const { MongoClient } = require('mongodb');
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

async function main() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();

  try {
    const results = await circulationRepo.loadData(data);
    assert.equal(data.length, results.insertedCount);

    const getData = await circulationRepo.get();
    assert.equal(data.length, getData.length);

    const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
    assert.deepEqual(filterData[0], getData[4]);

    const limitData = await circulationRepo.get({}, 3);
    assert.equal(limitData.length, 3);

    const id = getData[4]._id.toString();

    const byId = await circulationRepo.getById(id);
    assert.deepEqual(byId, getData[4]);
    console.log(byId);
    //
  } catch (error) {
    console.log(error);
  } finally {
    // const admin = client.db(DB_NAME).admin();
    await client.db(DB_NAME).dropDatabase();
    // console.log(await admin.listDatabases());
    client.close();
  }
}

main();
