var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

var myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./middlewares/auth');

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts');
const usersRoute = require('./routes/users');
app.use('/posts', auth, postsRoute);
app.use('/accounts', usersRoute);

//ROUTES
app.get('/', auth, (req, res) => {
  res.send(`Hello ${req.user.first_name} ${req.user.last_name}`);
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
