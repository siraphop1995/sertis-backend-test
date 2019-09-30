const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

app = express();
port = process.env.PORT || 3000;

User = require('./api/models/userListModel');
Card = require('./api/models/cardListModel');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(
  'mongodb+srv://admin:admin@cluster0-yejh3.gcp.mongodb.net/siraphop?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  function(error) {
    if (error) throw error;
    console.log('Successfully connected');
  }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRouter = require('./api/routes/userRouter');
const cardRouter = require('./api/routes/cardRouter');

app.use(userRouter);
app.use(cardRouter);


app.use(errorHandler)

function errorHandler (err, req, res, next) {
  console.error(err)
  let newError = {
    message: err.message,
  }
  res.status(500).send(newError);
}

app.listen(port);

console.log('Server started on : ' + port);
