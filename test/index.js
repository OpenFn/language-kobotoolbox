import { expect } from 'chai';

import nock from 'nock';
import ClientFixtures, { fixtures } from './ClientFixtures';

import Adaptor from '../src';
const { execute, post } = Adaptor;

import { getSubmissions } from '../lib/Adaptor';

describe('execute', () => {
  it('executes each operation in sequence', done => {
    let state = {};
    let operations = [
      state => {
        return { counter: 1 };
      },
      state => {
        return { counter: 2 };
      },
      state => {
        return { counter: 3 };
      },
    ];

    execute(...operations)(state)
      .then(finalState => {
        expect(finalState).to.eql({ counter: 3 });
      })
      .then(done)
      .catch(done);
  });

  it('assigns references, data to the initialState', () => {
    let state = {};

    let finalState = execute()(state);

    execute()(state).then(finalState => {
      expect(finalState).to.eql({ references: [], data: null });
    });
  });
});

describe('getSubmissions', () => {
  before(() => {
    nock('https://kf.kobotoolbox.org')
      .get('/api/v2/assets/aXecHjmbATuF6iGFmvBLBX/data/?format=json')
      .basicAuth({ user: 'john', pass: 'doe' })
      .reply(200, {
        count: 2,
        next: null,
        previous: null,
        results: [{}, {}],
      });
  });
  it('should get a lsit of submissions', () => {
    let state = {
      configuration: {
        username: 'john',
        password: 'doe',
        baseURL: 'https://kf.kobotoolbox.org',
        // type: 'process.env.type',
        apiVersion: 'v2',
      },
    };
    return execute(getSubmissions('aXecHjmbATuF6iGFmvBLBX', {}))(state).then(
      nextState => {
        expect(nextState.data).to.deep.eq({
          count: 2,
          next: null,
          previous: null,
          results: [{}, {}],
        });
      }
    );
  }).timeout(10 * 1000);
});
