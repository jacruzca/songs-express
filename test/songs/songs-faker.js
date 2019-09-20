const faker = require('faker');

const buildFakeSong = (defaults) => {
  const song = {
    title: faker.name.title(),
    artist: faker.name.firstName(),
    genre: faker.random.alphaNumeric(),
    length: faker.random.number(),
    location: faker.system.fileName(),
  };
  return {
    ...song,
    ...defaults,
  };
};

module.exports = { buildFakeSong };
