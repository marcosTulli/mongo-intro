const { MONGO_URL, DB_NAME } = require('./variables');
const assert = require('assert');
const { MongoClient } = require('mongodb');
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

async function main() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  try {
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged deployment. Successfully connected to MongoDB!\n - - - - -');
  } catch (error) {
    console.log(error);
  }

  try {
    // LOAD
    const results = await circulationRepo.loadData(data);
    console.log('Testing LoadData');
    assert.equal(data.length, results.insertedCount);
    console.log('LoadData OK\n - - - - -');

    // GET
    // console.log('Testing GetData');
    // const getData = await circulationRepo.get();
    // assert.equal(data.length, getData.length);
    // console.log('GetData OK\n - - - - -');

    // FILTER
    // console.log('Testing FilterData');
    // const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
    // assert.deepEqual(filterData[0], getData[4]);
    // console.log('FilterData OK\n - - - - -');

    // LIMIT
    // console.log('Testing Limit Data');
    // const limitData = await circulationRepo.get({}, 3);
    // assert.equal(limitData.length, 3);
    // const id = getData[4]._id.toString();
    // console.log('Limit Data OK\n - - - - -');

    // GET BY ID
    // console.log('Testing GetByID');
    // const byId = await circulationRepo.getById(id);
    // assert.deepEqual(byId, getData[4]);
    // console.log('GetByID OK\n - - - - -');

    const newItem = {
      'Newspaper': 'My Paper',
      'Daily Circulation, 2004': 1,
      'Daily Circulation, 2013': 2,
      'Change in Daily Circulation, 2004-2013': 100,
      'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
      'Pulitzer Prize Winners and Finalists, 2004-2014': 0,
      'Pulitzer Prize Winners and Finalists, 1990-2014': 0,
    };

    // ADD

    // console.log('Testing Add Item');
    // const addItem = await circulationRepo.add(newItem);
    // assert(addItem.insertedId);
    // const addItemQuery = await circulationRepo.getById(addItem.insertedId);
    // assert.deepEqual(addItemQuery, newItem);
    // console.log('Add Item OK\n - - - - -');

    // UPDATE

    // console.log('Testing Update Item');
    // const updatedItem = await circulationRepo.update(addItem.insertedId, {
    //   'Newspaper': 'My new Paper',
    //   'Daily Circulation, 2004': 1,
    //   'Daily Circulation, 2013': 2,
    //   'Change in Daily Circulation, 2004-2013': 100,
    //   'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
    //   'Pulitzer Prize Winners and Finalists, 2004-2014': 0,
    //   'Pulitzer Prize Winners and Finalists, 1990-2014': 0,
    // });
    // assert.equal(updatedItem.Newspaper, 'My new Paper');

    // const newAddedItemQuery = await circulationRepo.getById(addItem.insertedId);
    // assert.equal(newAddedItemQuery.Newspaper, 'My new Paper');
    // console.log('Update Item OK\n - - - - -');

    // DELETE

    // console.log('Testing Delete Item');
    // const removed = await circulationRepo.remove(addItem.insertedId);
    // assert(removed);
    // console.log('Deleted Item OK\n - - - - -');

    // GET AVERAGE

    // console.log('Getting average finalists');
    // const avgFinalists = await circulationRepo.averageFinalists();
    // console.log(`Average finalists: ${avgFinalists}`);

    // GET AVERAGE BY  CHANGE
    console.log('Getting average finalists');
    const avgByChange = await circulationRepo.averageFinalistsByChange();
    console.log(avgByChange);

    //
  } catch (error) {
    console.log(error);
  } finally {
    // const admin = client.db(DB_NAME).admin();
    console.log('Dropping DB');
    await client.db(DB_NAME).dropDatabase();
    console.log('DB dropped OK\n - - - - -');
    // console.log(await admin.listDatabases());
    client.close();
    console.log('Closed');
  }
}

main();
