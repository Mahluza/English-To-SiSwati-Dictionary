const { MongoClient, ObjectId } = require('mongodb');
const redis = require('redis');
const { promisify } = require('util');

/**
 * Creates object that stores functions for performing CRUD operations on databases
 */
function myDb() {
  // object
  const myDb = {};
  const dbName = 'eng-sis-dictionary-v1';
  // collection name
  const collName = 'words';

  // link to online database
  const uri =
    process.env.MONGODB_URI ||
    'mongodb+srv://admin:BthJQytGeo70RxoR@eng-sis-dictionary-west.6m87r.mongodb.net/eng-sis-dictionary-v1?retryWrites=true&w=majority';

  //
  const rClient = redis.createClient(process.env.REDIS_URL);

  rClient.on('error', function (error) {
    // TODO: handle errors
    console.error(error);
  });

  /**
   * Find definition of word user is querying
   * Add it to user's search hsitory
   *
   * @param word word being queried
   * @param phoneId id of user's phone
   * @return mongo document of queried word
   */
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
      // if word exists, add it to search history
      if (doc.length != 0) await pZadd('history:' + phoneId, +new Date(), word);
      return doc;
    } finally {
      // TODO: Perhaps close the redis client?
      client.close();
    }
  };

  /**
   * Retrieve search history
   *
   * @param phoneId id of user's phone
   * @return user's search history
   */
  myDb.getHistory = async function (phoneId) {
    // zrevrange reverses elements of sorted set
    const pZrange = promisify(rClient.zrevrange).bind(rClient);
    const history = await pZrange('history:' + phoneId, 0, -1, 'withscores');
    return history;
  };

  /**
   * Delete single word from search history
   *
   * @param phoneId id of user's phone
   * @param word word to be deleted
   */
  myDb.delHistory = async function (phoneId, word) {
    const pZrem = promisify(rClient.zrem).bind(rClient);
    await pZrem('history:' + phoneId, word);
  };

  /**
   * Retrieves lists that user has created to store words
   *
   * @param phoneID id of user's phone
   * @return lists associated with a particular phone's id
   */
  myDb.findLists = async function (phoneID) {
    const client = MongoClient(uri, { useunifiedToplogy: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const coll = db.collection(collName);
      let nameSet = new Set();
      const query = { 'list.phoneID': phoneID };

      let docs = await coll.find(query).toArray();
      // multiple phone IDs can be associated with one document
      // sift documents to only collect list names associated id of phone being used
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

  /**
   * Retrieves the words in a list
   *
   * @param phoneID id of user's phone
   * @param listName the name of the user's list
   * @return the words in a user's list
   */
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

  /**
   * Deletes an entire list of words
   *
   * @param phoneID id of user's phone
   * @param listName the name of the user's list
   */
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

  /**
   * Deletes a single word from a list
   *
   * @param docID mongo id of word document to be deleted
   * @param sentListName list that word belongs to
   * @param sentPhoneID id of user's phone
   */
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
