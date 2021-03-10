const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
// var cors = require('cors');

const port = process.env.PORT || 5000;

// MIDDLEWARE
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// APIs
const methods = require('./routes/methods');
app.use('/api', methods);

if (process.env.NODE_ENV === 'production') {
  // pass client build to server
  app.use(express.static('frontend/build'));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
