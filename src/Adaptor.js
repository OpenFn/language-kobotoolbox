import {
  execute as commonExecute,
  composeNextState,
  expandReferences,
} from 'language-common';
import axios from 'axios';
import { resolve as resolveUrl } from 'url';
import { resolve } from 'path';

/** @module Adaptor */

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null,
  };

  return state => {
    return commonExecute(...operations)({
      ...initialState,
      ...state,
    });
  };
}

/**
 * Make a request to get the list of forms
 * @example
 *   getForms({}, state => {
 *      console.log(state.data);
 *      return state; 
 *   });
 * @constructor
 * @param {object} params - data to make the fetch
 * @returns {Operation}
 */
export function getForms(params, callback) {
  return state => {
    const { host, username, password } = state.configuration;
    const { body, headers } = expandReferences(params)(state);

    return axios({
      method: 'GET',
      baseURL: host,
      auth: { username, password },
    })
      .then(response => {
        console.log(
          'Printing response...\n',
          response.data.count + ' forms fetched... \n'
        );

        const nextState = composeNextState(state, response.data);
        if (callback) return callback(nextState);
        return nextState;
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  };
}

// Note that we expose the entire axios package to the user here.
exports.axios = axios;

// What functions do you want from the common adaptor?
export {
  alterState,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  lastReferenceValue,
  merge,
  sourceValue,
} from 'language-common';
