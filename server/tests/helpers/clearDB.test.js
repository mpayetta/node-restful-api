import { expect } from 'chai';
import { clearDatabase } from '../../helpers/ClearDB';

describe('## Clear database helper', () => {
  it('should throw when not in test environment', (done) => {
    process.env.NODE_ENV = 'development';
    expect(clearDatabase).to.throw(Error);
    process.env.NODE_ENV = 'test';
    done();
  });
});
