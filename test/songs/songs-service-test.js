const mongoose = require('mongoose');
const { expect } = require('chai');

const { SongsService } = require('../../lib/songs/songs-container');

const { ValidationError } = mongoose.Error;

const { buildFakeSong } = require('./songs-faker');
const {
  DatabaseError,
  CustomValidationError,
  NotFoundError,
} = require('../../lib/utils/errors');

describe('songs service', async () => {
  describe('listSongs', async () => {
    const SongModelMock = (expected) => {
      const SongModel = {
        find() {
          return this;
        },
        limit() {
          return this;
        },
        skip() {
          return expected;
        },
      };
      return SongModel;
    };

    it('should return an empty list of songs', async () => {
      const expected = [];
      const songsService = SongsService(
        SongModelMock(Promise.resolve(expected)),
      );

      const songs = await songsService.listSongs({});
      expect(songs).to.be.empty;
    });
    it('should return a list of songs', async () => {
      const expected = [buildFakeSong(), buildFakeSong()];
      const songsService = SongsService(
        SongModelMock(Promise.resolve(expected)),
      );

      const songs = await songsService.listSongs({});
      expect(songs.length).to.be.equal(expected.length);
    });

    it('should throw a database error', async () => {
      const songsService = SongsService(
        SongModelMock(Promise.reject(new Error('DB error'))),
      );

      try {
        await songsService.listSongs({});
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(DatabaseError);
      }
    });
  });

  describe('createSong', async () => {
    const SongModelMock = (expected) => {
      const SongModel = {
        create() {
          return expected;
        },
      };
      return SongModel;
    };
    it('should successfully create a song', async () => {
      const expectedSong = buildFakeSong();
      const songsService = SongsService(
        SongModelMock(Promise.resolve(expectedSong)),
      );
      const song = await songsService.createSong(expectedSong);
      expect(song.title).to.be.equal(expectedSong.title);
    });

    it('should throw a validation error', async () => {
      const songsService = SongsService(
        SongModelMock(Promise.reject(new ValidationError())),
      );
      try {
        await songsService.createSong(buildFakeSong());
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(CustomValidationError);
      }
    });

    it('should throw a database error', async () => {
      const songsService = SongsService(
        SongModelMock(Promise.reject(new Error())),
      );
      try {
        await songsService.createSong(buildFakeSong());
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(DatabaseError);
      }
    });
  });

  describe('getSongById', async () => {
    const SongModelMock = (expected) => {
      const SongModel = {
        findOne() {
          return expected;
        },
      };
      return SongModel;
    };
    it('should successfully return a song', async () => {
      const expectedSong = buildFakeSong();
      const songsService = SongsService(
        SongModelMock(Promise.resolve(expectedSong)),
      );
      const song = await songsService.getSongById(1);
      expect(song.title).to.be.equal(expectedSong.title);
    });

    it('should throw a not found error', async () => {
      const songsService = SongsService(SongModelMock(Promise.resolve(null)));
      try {
        await songsService.getSongById(2);
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(NotFoundError);
      }
    });
  });
});
