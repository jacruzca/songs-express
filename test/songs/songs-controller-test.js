const mongoose = require('mongoose');
const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const { ValidationError } = mongoose.Error;

const { buildFakeSong } = require('./songs-faker');
const { SongModel } = require('../../lib/songs/songs-schema');
const {
  DatabaseError,
  CustomValidationError,
  NotFoundError,
} = require('../../lib/utils/errors');
const {
  listSongs,
  createSong,
  getSongById,
} = require('../../lib/songs/songs-controller');

describe('songs controller', async () => {
  const SongModelMock = sinon.mock(SongModel);
  describe('listSongs', async () => {
    it('should return an empty list of songs', async () => {
      SongModelMock.expects('find')
        .chain('limit')
        .chain('skip')
        .resolves([]);
      const songs = await listSongs({});

      expect(songs).to.be.empty;
    });
    it('should return a list of songs', async () => {
      const expectedSongs = [buildFakeSong(), buildFakeSong()];
      SongModelMock.expects('find')
        .chain('limit')
        .chain('skip')
        .resolves(expectedSongs);
      const songs = await listSongs({});
      expect(songs.length).to.be.equal(expectedSongs.length);
    });

    it('should throw a database error', async () => {
      SongModelMock.expects('find')
        .chain('limit')
        .chain('skip')
        .rejects(new Error('DB error'));

      try {
        await listSongs({});
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(DatabaseError);
      }
    });
  });

  describe('createSong', async () => {
    it('should successfully create a song', async () => {
      const expectedSong = buildFakeSong();
      SongModelMock.expects('create').resolves(expectedSong);
      const song = await createSong(expectedSong);
      expect(song.title).to.be.equal(expectedSong.title);
    });

    it('should throw a validation error', async () => {
      SongModelMock.expects('create').rejects(new ValidationError());
      try {
        await createSong(buildFakeSong());
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(CustomValidationError);
      }
    });

    it('should throw a database error', async () => {
      SongModelMock.expects('create').rejects(new Error());
      try {
        await createSong(buildFakeSong());
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(DatabaseError);
      }
    });
  });

  describe('getSongById', async () => {
    it('should successfully return a song', async () => {
      const expectedSong = buildFakeSong();
      SongModelMock.expects('findOne').resolves(expectedSong);
      const song = await getSongById(expectedSong);
      expect(song.title).to.be.equal(expectedSong.title);
    });

    it('should throw a not found error', async () => {
      SongModelMock.expects('findOne').resolves(null);
      try {
        await getSongById(buildFakeSong());
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(NotFoundError);
      }
    });
  });
});
