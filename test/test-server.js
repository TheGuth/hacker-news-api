const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const {Story} = require('../models');

chai.use(chaiHttp);

function seedStoryData() {
  let seedData = [];
  for (let i = 0; i <= 30; i++) {
    seedData.push(createStory());
  }
  console.log(seedData);
  Story
    .insertMany(seedData)
}

function createStory() {
  return {
      title: faker.lorem.sentence(),
      url: faker.internet.domainName(),
      votes: faker.random.number()
    }
}

function seedData() {
    console.info('Seeding data');
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
    return seedData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  })
});
