import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import config from '../../../config/env';
import app from '../../../index';
import { clearDatabase } from '../../helpers/ClearDB';
import User from '../../models/user';

require('sinon-mongoose');
require('sinon-as-promised');
chai.config.includeStack = true;

describe('## User APIs', () => {
  let sandbox;
  let user = {
    password: 'KK123',
    mobile: '18616347169'
  };

  const authHeader = {
    Authorization: `Bearer ${config.jwt.sample}`
  };

  before((done) => {
    clearDatabase(() => {
      done();
    });
  });

  beforeEach((done) => {
    sandbox = sinon.sandbox.create();
    done();
  });

  after((done) => {
    clearDatabase(() => {
      done();
    });
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).to.equal(user.mobile);
          expect(res.body.mobile).to.equal(user.mobile);
          expect(res.body.password).to.exist;
          user = res.body;
          done();
        });
    });

    it('should return Internal Server Error when mongoose fails to save user', (done) => {
      const createStub = sandbox.stub(User, 'create');
      createStub.rejects({});
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .set(authHeader)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).to.equal(user.username);
          expect(res.body.mobile).to.equal(user.mobile);
          done();
        });
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set(authHeader)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.error).to.equal('User not found');
          done();
        });
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.username = 'KK';
      request(app)
        .put(`/api/users/${user._id}`)
        .set(authHeader)
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.username).to.equal('KK');
          expect(res.body.mobile).to.equal(user.mobile);
          done();
        });
    });

    it('should return Internal Server Error when mongoose fails to save user', (done) => {
      const mockedUser = Object.assign({}, user); // copy user into mock object
      mockedUser.save = function () {
        return new Promise((resolve, reject) => {
          reject({});
        });
      };
      sandbox.mock(User)
        .expects('findById')
        .resolves(mockedUser);
      request(app)
        .put(`/api/users/${user._id}`)
        .set(authHeader)
        .send(user)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .put('/api/users/56c787ccc67fc16ccc1a5e92')
        .set(authHeader)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.error).to.equal('User not found');
          done();
        });
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .set(authHeader)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should return Internal Server Error when mongoose fails to save user', (done) => {
      sandbox.mock(User)
        .expects('list')
        .rejects({});
      request(app)
        .get('/api/users/')
        .set(authHeader)
        .send(user)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });
  });

  describe('# DELETE /api/users/:userId', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set(authHeader)
        .expect(httpStatus.NO_CONTENT)
        .then(res => done());
    });

    it('should return Internal Server Error when mongoose fails to save user', (done) => {
      const mockedUser = Object.assign({}, user); // copy user into mock object
      mockedUser.remove = function () {
        return new Promise((resolve, reject) => {
          reject({});
        });
      };
      sandbox.mock(User)
        .expects('findById')
        .resolves(mockedUser);
      request(app)
        .delete(`/api/users/${user._id}`)
        .set(authHeader)
        .send(user)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then(() => done());
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .delete('/api/users/56c787ccc67fc16ccc1a5e92')
        .set(authHeader)
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.error).to.equal('User not found');
          done();
        });
    });
  });
});
