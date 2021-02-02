import { expect } from 'chai';

import nock from 'nock';

import Adaptor from '../src';
const { execute } = Adaptor;

import { getSubmissions, getForms } from '../lib/Adaptor';

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
  it('should get a list of submissions', () => {
    let state = {
      configuration: {
        username: 'john',
        password: 'doe',
        baseURL: 'https://kf.kobotoolbox.org',
        // type: 'process.env.type',
        apiVersion: 'v2',
      },
    };
    return execute(getSubmissions({ formId: 'aXecHjmbATuF6iGFmvBLBX' }))(
      state
    ).then(nextState => {
      expect(nextState.data).to.deep.eq({
        count: 2,
        next: null,
        previous: null,
        results: [{}, {}],
      });
    });
  }).timeout(10 * 1000);
});

describe('getForms', () => {
  before(() => {
    nock('https://kf.kobotoolbox.org')
      .get('/api/v2/assets/?format=json')
      .basicAuth({ user: 'john', pass: 'doe' })
      .reply(200, {
        count: 10,
        next: null,
        previous: null,
        results: [{}, {}],
      });

    nock('https://kf.kobotoolbox.org')
      .get('/api/v2/differentAssets/?format=json')
      .basicAuth({ user: 'john', pass: 'doe' })
      .reply(404, {
        body: 'A 404 error.',
      });

    nock('https://kf.kobotoolbox.org')
      .get('/api/v2/fakeAssets/?format=json')
      .basicAuth({ user: 'john', pass: 'doe' })
      .reply(500, {
        body: 'Another error.',
      });
  });

  it('should get a list of forms', () => {
    let state = {
      configuration: {
        username: 'john',
        password: 'doe',
        baseURL: 'https://kf.kobotoolbox.org',
        apiVersion: 'v2',
      },
    };
    return execute(getForms('assets/?format=json'))(state).then(nextState => {
      expect(nextState.data).to.deep.eq({
        count: 10,
        next: null,
        previous: null,
        results: [{}, {}],
      });
    });
  }).timeout(10 * 1000);

  it('throws an error for a 404 response', () => {
    const state = {
      configuration: {
        username: 'john',
        password: 'doe',
        baseURL: 'https://kf.kobotoolbox.org',
        apiVersion: 'v2',
      },
    };

    return execute(getForms('differentAssets/?format=json'))(state).catch(
      error => {
        expect(error.message).to.eql('Request failed with status code 404');
      }
    );
  });

  it('throws different kind of errors', () => {
    const state = {
      configuration: {
        username: 'john',
        password: 'doe',
        baseURL: 'https://kf.kobotoolbox.org',
        apiVersion: 'v2',
      },
    };

    return execute(getForms('fakeAssets/?format=json'))(state).catch(error => {
      expect(error.message).to.eql('Request failed with status code 500');
    });
  });
});
