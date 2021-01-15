/** @module Adaptor */

import {
  execute as commonExecute,
  composeNextState,
  expandReferences,
  http,
} from 'language-common';

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @function
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
 * @public
 * @example
 * getForms(state => {
 *    console.log(state.data);
 *    return state;
 * });
 * @function
 * @param {function} callback - callback to execute after fetching form list
 * @returns {Operation}
 */
export function getForms(callback) {
  return state => {
    const { baseURL, apiVersion, username, password } = state.configuration;

    return http
      .get({
        baseURL,
        url: `api/${apiVersion}/assets/?format=json`,
        auth: { username, password },
      })(state)
      .then(response => {
        console.log('✓', response.data.count, 'forms fetched.');
        const nextState = composeNextState(state, response.data);
        if (callback) return callback(nextState);
        return nextState;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  };
}

/**
 * Get submissions for a specific form
 * @example
 * getSubmissions('aXecHjmbATuF6iGFmvBLBX', {}, state => {
 *   console.log(state.data);
 *   return state;
 * });
 * @function
 * @param {string} formId - id of the form
 * @param {object} params - data to make the fetch or filter
 * @param {function} callback - callback to execute after fetching form submissions.
 * @returns {Operation}
 */
export function getSubmissions(formId, params, callback) {
  return state => {
    const { baseURL, apiVersion, username, password } = state.configuration;
    const { body, headers, query } = expandReferences(params)(state);

    return http
      .get({
        baseURL,
        url: `api/${apiVersion}/assets/${formId}/data/?format=json`,
        auth: { username, password },
        params: {
          query: JSON.stringify(query),
        },
      })(state)
      .then(response => {
        console.log('✓', response.data.count, 'submissions fetched.');

        const nextState = composeNextState(state, response.data);
        if (callback) return callback(nextState);
        return nextState;
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  };
}

export {
  alterState,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  http,
  lastReferenceValue,
  merge,
  sourceValue,
} from 'language-common';
