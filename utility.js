const faker = require('faker');
const {Story} = require('./models');

function createStory() {
  return {
      title: faker.lorem.sentence(),
      url: faker.internet.domainName(),
      votes: faker.random.number()
    }
}

exports.seedStoryData = function () {
  let seedData = [];
  for (let i = 0; i <= 30; i++) {
    seedData.push(createStory());
  }
  Story
    .insertMany(seedData)
}
