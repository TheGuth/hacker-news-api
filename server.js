const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();
app.use(bodyParser.json());

const {Story} = require('./models.js');


app.get('/stories', (req, res) => {
  Story
    .find()
    .limit(20)
    // add query to find top 20 stories by votes.
    .exec()
    .then()

});

app.post('/stories', (req, res) => {
  const requiredFields = ['title', 'url'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)){
      const message = `Missing ${field} in request body.`;
      res.status(400).send(message);
    }
  }
  Story
    .create({
      title: req.body.title,
      url: req.body.url,
      votes: 0

    })
    .then(response => {
      res.status(201).json(response.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: `Internal Server Error`});
    })
});

// API endpoints go here

let server;
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {

        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
