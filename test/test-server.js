const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {Story} = require('../models');
const {seedStoryData} = require('../utility');



chai.use(chaiHttp);

function createStory() {
  return {
      title: faker.lorem.sentence(),
      url: faker.internet.domainName(),
      votes: faker.random.number()
    }
}

function tearDownDb() {
  console.info('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Hacker News API', function() {

  before(function() {
    return runServer();
  });

  beforeEach(function() {
    console.info('Seeding data');
    return seedStoryData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })

  describe('GET endpoint', function() {

    let res;
    it('should return the top 20 stories by most votes', function() {
      return chai.request(app)
        .get('/stories')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.storiesJson.should.have.length.of.at.least(1);
          return Story.count();
        })
        .then(function(count) {
          res.body.storiesJson.should.have.length.of(20);
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new Story', function() {
      const newStory = createStory();
      newStory.votes = 0;

      return chai.request(app)
        .post('/stories')
        .send(newStory)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.should.be.a('object');
          res.body.should.include.keys('title', 'url', 'votes', 'id');
          res.body.id.should.not.be.null;
          res.body.title.should.equal(newStory.title);
          res.body.url.should.equal(newStory.url);
          res.body.votes.should.equal(newStory.votes);
          newStory.id = res.body.id;
          return Story.findById(res.body.id);
        })
        .then(story => {
          story.title.should.equal(newStory.title);
          story.url.should.equal(newStory.url);
          story.votes.should.equal(newStory.votes);
          story.id.should.equal(newStory.id);
        });
    });
  });
  describe('PUT endpoint', function() {
    it('should increment the vote count by only 1', function() {
      let putStory;
        return chai.request(app)
          .get('/stories')
          .then(res => {
            putStory = res.body.storiesJson[0];
            console.log(putStory.id);
            return chai.request(app)
              .put(`/stories/${putStory.id}`)

          })
          .then( item => {
            console.log('item: ', item);
            item.should.have.status(204);

            return Story.findById(putStory.id)
          })
          .then(response => {
            response.votes.should.equal(putStory.votes + 1);
          });

      });
    });



});
