const mongoose = require('mongoose');
const { expect } = require('chai');

const { SongModel } = require('../../lib/songs/songs-schema');

describe('songs schema validation', () => {
  it('should be invalid if required fields are empty', (done) => {
    const song = new SongModel({});

    song.validate((err) => {
      expect(err).to.be.an.instanceof(mongoose.Error.ValidationError);
      done();
    });
  });
});
