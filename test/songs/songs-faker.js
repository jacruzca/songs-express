const faker = require('faker');

const buildFakeSong = (defaults) => {
  const song = {
    title: faker.title,
    artist: faker.name,
    genre: faker.random.alphaNumeric,
    length: faker.random.number,
    location: faker.system.fileName,
  };
  return {
    ...song,
    ...defaults,
  };
};

module.exports = { buildFakeSong };
