import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../../index';
import { clearDatabase } from '../../helpers/ClearDB';
import User from '../../models/user';

require('sinon-mongoose');
require('sinon-as-promised');
chai.config.includeStack = true;

describe('## Authentication', () => {
  let user;
  let sandbox;

  before((done) => {
    sandbox = sinon.sandbox.create();
    clearDatabase(() => {
      request(app)
        .post('/api/users')
        .send({ mobile: '12345678901', password: '123456' })
        .expect(httpStatus.OK)
        .then(res => {
          user = res.body;
          done();
        });
    });
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  after((done) => {
    clearDatabase(() => {
      done();
    });
  });

  describe('# POST /api/auth/token', () => {
    it('should return jwt', (done) => {
      request(app)
        .post('/api/auth/token')
        .send({ mobile: user.mobile, password: '123456' })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.token).to.exist;
          expect(res.body.user.refresh).to.exist;
          user.refresh = res.body.user.refresh;
          done();
        });
    });

    it('should return Unauthorized when password does not match', (done) => {
      request(app)
        .post('/api/auth/token')
        .send({ mobile: user.mobile, password: '654321' })
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        });
    });

    it('should return Unauthorized when user does not exist', (done) => {
      request(app)
        .post('/api/auth/token')
        .send({ mobile: '98765432109', password: '123456' })
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        });
    });

    it('should return Bad Request when missing mobile', (done) => {
      request(app)
        .post('/api/auth/token')
        .send({ password: 'pass' })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.error).to.equal('"mobile" is required');
          done();
        });
    });

    it('should return Bad Request when missing password', (done) => {
      request(app)
        .post('/api/auth/token')
        .send({ mobile: '12345678901' })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.error).to.equal('"password" is required');
          done();
        });
    });

    it('should return Internal Server Error when mongoose fails to query', (done) => {
      sandbox.mock(User)
        .expects('findOne')
        .rejects({});
      request(app)
        .post('/api/auth/token')
        .send({ mobile: user.mobile, password: '123456' })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });

    it('should return Internal Server Error when mongoose fails to save user', (done) => {
      const mockedUser = Object.assign({}, user); // copy user into mock object
      mockedUser.comparePassword = function (p, cb) {
        return cb(null, true);
      };
      mockedUser.save = function () {
        return new Promise((resolve, reject) => {
          reject({});
        });
      };
      sandbox.mock(User)
        .expects('findOne')
        .resolves(mockedUser);
      request(app)
        .post('/api/auth/token')
        .send({ mobile: user.mobile, password: '123456' })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });

    it('should return Internal Server Error when compare password fails', (done) => {
      const mockedUser = Object.assign({}, user); // copy user into mock object
      mockedUser.comparePassword = function (p, cb) {
        return cb({}); // callback with some error
      };
      sandbox.mock(User)
        .expects('findOne')
        .resolves(mockedUser);
      request(app)
        .post('/api/auth/token')
        .send({ mobile: user.mobile, password: '123456' })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });
  });

  describe('# POST /api/auth/refresh', () => {
    it('should return jwt', (done) => {
      request(app)
        .post('/api/auth/refresh')
        .send({ mobile: user.mobile, refresh: user.refresh })
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.token).to.exist;
          done();
        });
    });

    it('should return Unauthorized when refresh token does not match', (done) => {
      request(app)
        .post('/api/auth/refresh')
        .send({ mobile: user.mobile, refresh: 'wrong-refresh' })
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        });
    });

    it('should return Unauthorized when user does not exist', (done) => {
      request(app)
        .post('/api/auth/refresh')
        .send({ mobile: '98765432109', refresh: user.refresh })
        .expect(httpStatus.UNAUTHORIZED)
        .then(() => {
          done();
        });
    });

    it('should return Bad Request when missing mobile', (done) => {
      request(app)
        .post('/api/auth/refresh')
        .send({ refresh: 'refresh' })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.error).to.equal('"mobile" is required');
          done();
        });
    });

    it('should return Bad Request when missing refresh', (done) => {
      request(app)
        .post('/api/auth/refresh')
        .send({ mobile: '12345678901' })
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.error).to.equal('"refresh" is required');
          done();
        });
    });

    it('should return Internal Server Error when mongoose fails to query', (done) => {
      sandbox.mock(User)
        .expects('findOne')
        .rejects({});
      request(app)
        .post('/api/auth/refresh')
        .send({ mobile: user.mobile, refresh: 'refresh-token' })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });
  });
});
