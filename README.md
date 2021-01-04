# Language Template [![Build Status](https://travis-ci.org/OpenFn/language-template.svg?branch=master)](https://travis-ci.org/OpenFn/language-template)

Language Pack for building expressions and operations to interact with the
[TEMPLATE] API.

## Documentation

## post

#### sample configuration

```json
{
  "baseURL": "https://kf.kobotoolbox.org/api",
  "username": "mamadou@openfn.org",
  "password": "supersecret",
  "apiVersion": "v2"
}
```

#### Get the list of forms

```js
getForms({}, state => {
  console.log(state.data);
  return state;
});
```

### Get submissions for a specific form
A query can be used to filter results.

```js
getSubmissions(
  'aXecHjmbATuF6iGFmvBLBX',
  { query: { end: { $gte: '2020-11-20' } } },
  state => {
    console.log(state.data);
    return state;
  }
);
```

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
