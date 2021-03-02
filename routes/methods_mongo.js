const myDb = require('../db/MyDb_mongo.js');

var express = require('express');
var router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/', function (req, res, next) {
  console.log(req.body);
  res.send({ message: 'We did it!' });
});

router.get('/definition', async (req, res) => {
  console.log('accessed');
  console.log(req.body);
  // think about where this would be obtained from
  const phoneId = 2;
  try {
    const doc = await myDb.findDef(req.body.word, phoneId);

    if (doc.length === 0) {
      let err =
        'Word not found, try another, for example: exception, fantasy, gruesome, or manner.';
      // res.render('index', {
      //   title: 'Welcome to the English to Siswati Dictionary',
      //   err: err,
      // });
    }

    const word = doc[0].word;
    const def = doc[0].siswatiDef.description;
    const type = doc[0].wordType;
    const docID = doc[0]._id;
    console.log('def', docID);
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

// so this should be a get right because it's not modifying anything *
router.post('/definition', async (req, res) => {
  console.log(req.body);
  // think about where this would be obtained from
  const phoneId = 2;
  try {
    const doc = await myDb.findDef(req.body.word, phoneId);

    if (doc.length === 0) {
      throw Error(
        'Word not found, try another, for example: exception, fantasy, gruesome, or manner.'
      );
      // let err =
      //   'Word not found, try another, for example: exception, fantasy, gruesome, or manner.';
      // res.render('index', {
      //   title: 'Welcome to the English to Siswati Dictionary',
      //   err: err,
      // });
    }

    const word = doc[0].word;
    const def = doc[0].siswatiDef.description;
    const type = doc[0].wordType;
    const docID = doc[0]._id;
    console.log('id:', docID);
    res.status(200).send({
      word: word,
      def: def,
      type: type,
      docID: docID,
    });
  } catch (err) {
    res.send({ errMsg: err.message });
    // console.log('got error from definition:', err);
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await myDb.getHistory(2);
    console.log('get method history', history);
    res.status(200).send({ history: history });
  } catch (err) {
    console.log(err.message);
  }
});

router.post('/history', async (req, res) => {
  console.log(req.body);
  try {
    const newHistory = await myDb.delHistory(2, req.body.word);
    console.log('post method new history', newHistory);
  } catch (err) {
    console.log(err.message);
  }
});

router.get('/lists', async (req, res) => {
  try {
    console.log('sent to add to list', req.body);
    const lists = await myDb.findLists(2);

    res.status(200).send({ lists: lists });
  } catch (err) {
    console.log('got error from add to list:', err);
  }
});

router.post('/addtolist', async (req, res) => {
  try {
    // console.log('sent to add to list', req.body);
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
  } catch (err) {
    console.log('got error from add to list:', err);
  }
});

router.post('/getwords', async (req, res) => {
  try {
    console.log('sent to list end point', req.body);
    const docs = await myDb.findWordsInList(2, req.body.listName);
    console.log('list name:', req.body.listName);
    var listID;
    var listCreationDate;
    var date = new Date();
    for (let word of docs) {
      for (let list of word.list) {
        console.log('list object', list);
        if (list.phoneID == 2 && list.listName == req.body.listName) {
          listID = list.list_id;
          listCreationDate = list.listCreationDate;
          break;
        }
      }
      break;
    }
    console.log('listID', listID);
    res.status(200).send({ words: docs });
    // res.render('wordsInList', {
    //   word: req.body.word,
    //   docID: req.body.docID,
    //   def: req.body.def,
    //   docs: docs,
    //   listID: listID,
    //   listName: req.body.listName,
    //   listCreationDate: listCreationDate,
    //   dateAdded: date.getDate(),
    //   type: req.body.type,
    //   title: `Welcome to the English to Siswati
    // Dictionary`,
    // });
  } catch (err) {
    console.log('got error from add to list:', err);
  }
});

router.post('/save', async (req, res) => {
  try {
    console.log('sent to save', req.body);
    const id = req.body.mongoId;
    // const listID = req.body.listID;
    const listName = req.body.lists;
    const addDate = req.body.addDate;
    const createDate = req.body.createDate;
    var name;
    for (name of listName) {
      await myDb.insertWordIntoList(
        id,
        /*listID,*/ name,
        2,
        addDate,
        createDate
      );
    }
  } catch (err) {
    console.log('got error from add to list:', err);
  }
});

router.post('/deleteword', async (req, res) => {
  try {
    console.log('sent to delete word', req.body);
    const id = req.body.docID;
    const listName = req.body.listName;
    const phoneID = req.body.phoneID;

    await myDb.deleteWordFromList(id, phoneID, listName);
    res.status(200).send({ msg: 'word deleted' });
  } catch (err) {
    console.log('got error from deleted:', err);
  }
});

router.post('/listdel', async (req, res) => {
  try {
    console.log('sent to listdel', req.body);
    const phoneID = req.body.phoneID;
    const listName = req.body.listName;

    await myDb.delList(phoneID, listName);

    res.status(200).send({ msg: listName + ' deleted' });
  } catch (err) {
    console.log('got error from deleted:', err);
  }
});

module.exports = router;
