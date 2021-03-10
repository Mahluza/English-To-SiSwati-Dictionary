const myDb = require('../db/MyDb.js');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send({ message: 'testing' });
});

/**
 * Gets definition of searched word
 */
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

/**
 * Gets user search history
 */
router.get('/history', async (req, res) => {
  try {
    const history = await myDb.getHistory(2);
    res.status(200).send({ history: history });
  } catch (err) {}
});

/**
 * Deletes word from user search history
 */
router.post('/history', async (req, res) => {
  try {
    await myDb.delHistory(2, req.body.word);
  } catch (err) {}
});

/**
 * Retrieves names of user's lists
 */
router.get('/lists', async (req, res) => {
  try {
    const lists = await myDb.findLists(2);
    res.status(200).send({ lists: lists });
  } catch (err) {}
});

/**
 * Retrieve words saved in a user's list
 */
router.post('/getwords', async (req, res) => {
  try {
    const docs = await myDb.findWordsInList(2, req.body.listName);
    // TODO: Review function of this loop
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

/**
 * Saves a word in a list
 */
router.post('/save', async (req, res) => {
  try {
    const id = req.body.mongoId;
    const listName = req.body.lists;
    const addDate = req.body.addDate;
    const createDate = req.body.createDate;
    var name;
    // If multiple lists were chosen, word will be saved in all of them
    for (name of listName) {
      await myDb.insertWordIntoList(id, name, 2, addDate, createDate);
    }
    // TODO: Refine success check
    res.send({ success: true });
  } catch (err) {
    res.send({ success: false });
  }
});

/**
 * Deletes a word from a list
 */
router.post('/deleteword', async (req, res) => {
  try {
    const id = req.body.docID;
    const listName = req.body.listName;
    const phoneID = req.body.phoneID;
    await myDb.deleteWordFromList(id, phoneID, listName);
    res.status(200).send({ msg: 'word deleted' });
  } catch (err) {}
});

/**
 * Deletes a user's list
 */
router.post('/listdel', async (req, res) => {
  try {
    const phoneID = req.body.phoneID;
    const listName = req.body.listName;
    await myDb.delList(phoneID, listName);
    res.status(200).send({ msg: listName + ' deleted' });
  } catch (err) {}
});

module.exports = router;
