const myDb = require('../db/MyDb_mongo.js');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send({ message: 'We did it!' });
});

router.get('/definition', async (req, res) => {
  // TODO: generate dynamically based on phoneId of phone being used
  const phoneId = 2;
  try {
    const doc = await myDb.findDef(req.body.word, phoneId);

    if (doc.length === 0) {
      let err =
        'Word not found, try another, for example: exception, fantasy, gruesome, or manner.';
    }

    const word = doc[0].word;
    const def = doc[0].siswatiDef.description;
    const type = doc[0].wordType;
    const docID = doc[0]._id;

    res.status(200).send({
      word: word,
      def: def,
      type: type,
      docID: docID,
    });
  } catch (err) {
    res.status(404).send({ errMsg: err });
  }
});

router.post('/definition', async (req, res) => {
  // TODO: generate dynamically based on phoneId of phone being used
  const phoneId = 2;
  try {
    const doc = await myDb.findDef(req.body.word, phoneId);

    if (doc.length === 0) {
      throw Error(
        'Word not found, try another, for example: exception, fantasy, gruesome, or manner.'
      );
    }

    const word = doc[0].word;
    const def = doc[0].siswatiDef.description;
    const type = doc[0].wordType;
    const docID = doc[0]._id;

    res.status(200).send({
      word: word,
      def: def,
      type: type,
      docID: docID,
    });
  } catch (err) {
    res.send({ errMsg: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await myDb.getHistory(2);
    res.status(200).send({ history: history });
  } catch (err) {}
});

router.post('/history', async (req, res) => {
  try {
    const newHistory = await myDb.delHistory(2, req.body.word);
  } catch (err) {}
});

router.get('/lists', async (req, res) => {
  try {
    const lists = await myDb.findLists(2);
    res.status(200).send({ lists: lists });
  } catch (err) {}
});

router.post('/addtolist', async (req, res) => {
  try {
    const lists = await myDb.findLists(2);

    res.render('addToLists', {
      docID: req.body.docID,
      word: req.body.word,
      def: req.body.def,
      lists: lists,
      type: req.body.type,
      title: `Welcome to the English to Siswati 
		Dictionary`,
    });
  } catch (err) {}
});

router.post('/getwords', async (req, res) => {
  try {
    const docs = await myDb.findWordsInList(2, req.body.listName);

    var listID;
    var listCreationDate;
    var date = new Date();
    for (let word of docs) {
      for (let list of word.list) {
        if (list.phoneID == 2 && list.listName == req.body.listName) {
          listID = list.list_id;
          listCreationDate = list.listCreationDate;
          break;
        }
      }
      break;
    }

    res.status(200).send({ words: docs });
  } catch (err) {}
});

router.post('/save', async (req, res) => {
  try {
    const id = req.body.mongoId;
    const listName = req.body.lists;
    const addDate = req.body.addDate;
    const createDate = req.body.createDate;
    var name;
    for (name of listName) {
      await myDb.insertWordIntoList(id, name, 2, addDate, createDate);
    }
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false });
  }
});

router.post('/deleteword', async (req, res) => {
  try {
    const id = req.body.docID;
    const listName = req.body.listName;
    const phoneID = req.body.phoneID;
    await myDb.deleteWordFromList(id, phoneID, listName);
    res.status(200).send({ msg: 'word deleted' });
  } catch (err) {}
});

router.post('/listdel', async (req, res) => {
  try {
    const phoneID = req.body.phoneID;
    const listName = req.body.listName;
    await myDb.delList(phoneID, listName);
    res.status(200).send({ msg: listName + ' deleted' });
  } catch (err) {}
});

module.exports = router;
