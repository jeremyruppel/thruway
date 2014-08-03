# thruway

A tiny middleware stack with error handler support and no dependencies

> [![NPM version][npm-badge]][npm]
> [![Build Status][travis-badge]][travis-ci]

## Installation

``` bash
$ npm install thruway
```

## Usage

**thruway** creates a generic middleware stack that follows the [express][1] middleware stack semantics very closely. It keeps the concept of passing two arguments for the "request" and "response", but these may be any values that you choose to provide.

``` javascript
var stack = require('thruway')();
var assert = require('assert');

// This is a middleware function that will receive
// the `req` and `res` values and a `next` continuation.
stack.use(function(req, res, next){
	assert.equal(req, 'REQ');
	assert.equal(res, 'RES');
	next();
});

// This is an error handler (note the arity of 4 and the
// first parameter, `err`). It will only be called if
// a middleware passes an error to `next`.
stack.use(function(err, req, res, next){
	throw err; // You could handle it here instead
});

// This kicks off the middleware stack and calls the
// callback at the end.
stack('REQ', 'RES', function(err, res){
	assert.equal(err, undefined);
	assert.equal(res, 'RES');
});
```

## License

[ISC License][LICENSE]

[1]: http://expressjs.com/
[npm]: http://badge.fury.io/js/thruway
[npm-badge]: https://badge.fury.io/js/thruway.svg
[travis-ci]: https://travis-ci.org/jeremyruppel/thruway
[travis-badge]: https://travis-ci.org/jeremyruppel/thruway.svg?branch=master
[LICENSE]: https://github.com/jeremyruppel/thruway/blob/master/LICENSE
