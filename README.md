# thruway

A tiny middleware stack with error handler support and no dependencies

> [![NPM version][npm-badge]][npm]
> [![Build Status][travis-badge]][travis-ci]

## Installation

``` bash
$ npm install thruway
```

## Usage

**thruway** creates a generic middleware stack that follows the [express][1] middleware stack semantics closely. It keeps the concept of passing two arguments for the "request" and "response", except that the "request" may be any value you wish and the "response" is a function that will exit the middleware stack.

``` javascript
var stack = require('thruway')();
var assert = require('assert');

// This is a middleware function that will receive
// the `req` value and `res` and `next` continuations.
// Calling `res(err, val)` will skip to the final callback
// while calling `next(err)` will continue down the stack.
stack.use(function(req, res, next){
	assert.equal(req, 'REQ');
	next();
});

// This middleware calls `res` with the `val` value to
// pass to the final callback.
stack.use(function(req, res, next){
	res(null, 'VAL');
});

// This is an error handler (note the arity of 4 and the
// first parameter, `err`). It will only be called if
// a middleware passes an error to `next`.
stack.use(function(err, req, res, next){
	throw err; // You should handle the error here instead
});

// This kicks off the middleware stack and calls the
// callback at the end.
stack('REQ', function(err, val){
	assert.equal(err, null);
	assert.equal(val, 'VAL');
});
```

### Middleware

Middleware are functions with the signature `fn(req, res, next)`, where:

- `req` is the value you passed to the stack. This can be anything you like and is only called "req" to mimic the express API.
- `res(err, val)` exits the stack and calls the final callback. No other middleware or error handlers will be run.
- `next(err)` yields control to the next middleware. If an error is yielded, the error handler stack will be run. If an error is not yielded and there are no more middleware, the final callback will be invoked with `val = undefined`.

### Error Handlers

Error handlers are functions with the signature `fn(err, req, res, next)`, where:

- `err` is the error that was passed to the stack. Each error handler is expected to pass this or another error to either `res` or `next`.
- `req` is the value you passed to the stack. This can be anything you like and is only called "req" to mimic the express API.
- `res(err, val)` exits the stack and calls the final callback. Error handlers must pass an error to this function. No other middleware or error handlers will be run.
- `next(err)` yields control to the next error handler. Error handlers must pass an error to this function. If there are no more error handlers, the final callback will be invoked with `val = undefined`.

## License

[ISC License][LICENSE]

[1]: http://expressjs.com/
[npm]: http://badge.fury.io/js/thruway
[npm-badge]: https://badge.fury.io/js/thruway.svg
[travis-ci]: https://travis-ci.org/jeremyruppel/thruway
[travis-badge]: https://travis-ci.org/jeremyruppel/thruway.svg?branch=master
[LICENSE]: https://github.com/jeremyruppel/thruway/blob/master/LICENSE
