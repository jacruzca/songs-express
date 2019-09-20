const { expect } = require('chai');
const sinon = require('sinon');
const { mockRequest, mockResponse } = require('mock-req-res');
const { buildFakeSong } = require('./songs-faker');
const { SongsController } = require('../../lib/songs/songs-container');
const {
  NotFoundError,
  CustomValidationError,
} = require('../../lib/utils/errors');

describe('songs controller', async () => {
  describe('getSongs', async () => {
    it('should successfully return a list of songs. Status 200', async () => {
      const req = mockRequest({ query: { title: 'abc' } });
      const res = mockResponse({ json: sinon.spy() });
      const expected = [buildFakeSong()];
      const SongsService = {
        listSongs: () => expected,
      };
      const songsController = SongsController(SongsService);

      await songsController.getSongs(req, res);
      expect(res.json.calledWith(expected)).to.be.true;
    });

    it('should return a 500 error if something unexpected happened', async () => {
      const req = mockRequest({ query: { title: 'abc' } });
      const res = mockResponse({ json: sinon.spy(), status: sinon.spy() });
      const SongsService = {
        listSongs: () => {
          throw new Error('unexpected found');
        },
      };
      const songsController = SongsController(SongsService);

      await songsController.getSongs(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  describe('downloadSong', async () => {
    it('should successfully download a song. Status 200', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse({ download: sinon.spy() });
      const expected = buildFakeSong();
      const SongsService = {
        getSongById: () => expected,
      };
      const songsController = SongsController(SongsService);

      await songsController.downloadSong(req, res);
      expect(res.download.called).to.be.true;
    });

    it('should return a 404 error if song was not found', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse({ download: sinon.spy(), status: sinon.spy() });
      const SongsService = {
        getSongById: () => {
          throw new NotFoundError('not found');
        },
      };
      const songsController = SongsController(SongsService);

      await songsController.downloadSong(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.called).to.be.true;
    });

    it('should return a 500 error if something unexpected happened', async () => {
      const req = mockRequest({ params: { id: '1' } });
      const res = mockResponse({ download: sinon.spy(), status: sinon.spy() });
      const SongsService = {
        getSongById: () => {
          throw new Error('unexpected error');
        },
      };
      const songsController = SongsController(SongsService);

      await songsController.downloadSong(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });

  describe('createRandomSong', async () => {
    it('should successfully create a song. Status 200', async () => {
      const req = mockRequest({});
      const res = mockResponse({ json: sinon.spy() });
      const expected = buildFakeSong();
      const SongsService = {
        createRandomSong: () => expected,
      };
      const songsController = SongsController(SongsService);

      await songsController.createRandomSong(req, res);
      expect(res.json.called).to.be.true;
    });

    it('should return a 400 error if song was not found', async () => {
      const req = mockRequest({});
      const res = mockResponse({ json: sinon.spy(), status: sinon.spy() });
      const SongsService = {
        createRandomSong: () => {
          throw new CustomValidationError('not found');
        },
      };
      const songsController = SongsController(SongsService);

      await songsController.createRandomSong(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.called).to.be.true;
    });

    it('should return a 500 error if something unexpected happened', async () => {
      const req = mockRequest({});
      const res = mockResponse({ json: sinon.spy(), status: sinon.spy() });
      const SongsService = {
        createRandomSong: () => {
          throw new Error('unexpected error');
        },
      };
      const songsController = SongsController(SongsService);

      await songsController.createRandomSong(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;
    });
  });
});
