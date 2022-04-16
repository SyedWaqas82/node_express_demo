var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

var myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);

//ROUTES
app.get('/', (req, res) => {
  res.send('Hello World');
});

//Connect To DB
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log('Database connected');
});

//Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
