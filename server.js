const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// var cors = require('cors');
const port = process.env.PORT || 5000;

// // database schema
// const schema = mongoose.Schema;
// export const dictionarySchema = new Schema({
//   word_id: Number,
//   word: String,
//   wordType: String,
//   siswatiDef: {
//     id: Number,
//     description: String,
//   },
//   list: [
//     {
//       list_id: Number,
//       listName: String,
//       phoneID: Number,
//       listCreationDate: String,
//       wordAdditionDate: String,
//     },
//   ],
// });

// // model
// const dictionaryWord = mongoose.model('dictionaryWord', dictionarySchema)

// mongoose.connect('mongodb://localhost/dictionary', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on('connected', () => {
//   console.log('mongoose is connected');
// });

// Middleware
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
// });

// pass client build to server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// apis
const methods = require('./routes/methods_mongo');

// app.get('/', (req, res) => {
//   res.send({ message: 'We did it!' });
// });

app.use('/', methods);

app.listen(port, () => console.log('Backend server live on ' + port));
