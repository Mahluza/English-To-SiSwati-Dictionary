const { MongoClient, ObjectId } = require('mongodb');
const redis = require('redis');

const { promisify } = require('util');

function myDb() {
  const myDb = {};
  const dbName = 'eng-sis-dictionary-v1';
  const collName = 'words';

  const uri =
    process.env.MONGODB_URI ||
    'mongodb+srv://admin:BthJQytGeo70RxoR@eng-sis-dictionary-west.6m87r.mongodb.net/eng-sis-dictionary-v1?retryWrites=true&w=majority';

  const rClient = redis.createClient(process.env.REDIS_URL);

  rClient.on('error', function (error) {
    // TODO: handle errors
    console.error(error);
  });

  myDb.findDef = async function (word, phoneId) {
    const client = MongoClient(uri, {
      useUnifiedToplogy: true,
    });
    const pZadd = promisify(rClient.zadd).bind(rClient);
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);
      const query = { word: word };
      const doc = await coll.find(query).toArray();
      if (doc.length != 0) await pZadd('history:' + phoneId, +new Date(), word);
      return doc;
    } finally {
      client.close();
    }
  };

  myDb.getHistory = async function (phoneId) {
    const pZrange = promisify(rClient.zrevrange).bind(rClient);
    // WITHSCORES
    const history = await pZrange('history:' + phoneId, 0, -1, 'withscores');
    return history;
  };

  myDb.delHistory = async function (phoneId, word) {
    const pZrem = promisify(rClient.zrem).bind(rClient);
    const newHistory = await pZrem('history:' + phoneId, word);
    return newHistory;
  };

  myDb.findLists = async function (phoneID) {
    const client = MongoClient(uri, { useunifiedToplogy: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);
      let nameSet = new Set();
      const query = { 'list.phoneID': phoneID };

      let docs = await coll.find(query).toArray();

      for (let col of docs) {
        for (let list of col.list) {
          if (list.phoneID === phoneID && list.listName != null) {
            nameSet.add(list.listName);
          }
        }
      }

      return await Array.from(nameSet);
    } finally {
      client.close();
    }
  };

  myDb.findWordsInList = async function (phoneID, listName) {
    const client = MongoClient(uri, { useunifiedToplogy: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);
      const query = {
        $and: [{ 'list.phoneID': phoneID }, { 'list.listName': listName }],
      };
      return await coll.find(query).toArray();
    } finally {
      client.close();
    }
  };

  myDb.delList = async function (phoneID, listName) {
    const client = MongoClient(uri, { useunifiedToplogy: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);
      // query returns all objects in an array
      const query = {
        $and: [{ 'list.phoneID': phoneID }, { 'list.listName': listName }],
      };
      const update = {
        $pull: { list: { phoneID: phoneID, listName: listName } },
      };
      const range = { multi: true };
      return await coll.updateMany(query, update, range);
    } finally {
      client.close();
    }
  };

  myDb.deleteWordFromList = async function (docID, sentPhoneID, sentListName) {
    const client = MongoClient(uri, { useunifiedToplogy: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);
      return await coll.updateOne(
        { _id: ObjectId(docID) },
        { $pull: { list: { phoneID: sentPhoneID, listName: sentListName } } }
      );
    } finally {
      client.close();
    }
  };

  myDb.insertWordIntoList = async function (
    docID,
    listName,
    phoneID,
    dateAdded,
    listCreationDate
  ) {
    const client = MongoClient(uri, { useunifiedToplogy: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);

      return await coll.update(
        { _id: ObjectId(docID) },
        {
          $push: {
            list: {
              listName: listName,
              phoneID: phoneID,
              listCreationDate: listCreationDate,
              wordAdditionDate: dateAdded,
            },
          },
        }
      );
    } finally {
      client.close();
    }
  };

  return myDb;
}

module.exports = myDb();
