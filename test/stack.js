var subject = require('..');
var assert = require('assert');

describe('stack', function() {
  it('returns a function', function() {
    assert.equal(typeof subject(), 'function');
  });
  it('calls the the middleware with `req` and `res`', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      assert.equal(req, 'REQ');
      assert.equal(res, 'RES');
      next();
    });

    stack('REQ', 'RES', done);
  });
  it('calls each middleware in series', function(done) {
    var stack = subject();
    var count = 0;

    function fn(req, res, next) {
      assert.equal(req, 'REQ');
      assert.equal(res, 'RES');
      count++;
      next();
    }

    stack.use(fn);
    stack.use(fn);
    stack.use(fn);

    stack('REQ', 'RES', function() {
      assert.equal(count, 3);
      done();
    });
  });
  it('yields `res` to the final callback', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      next();
    });

    stack('REQ', 'RES', function(err, res) {
      assert.equal(err, null);
      assert.equal(res, 'RES');
      done();
    });
  });
  it('yields `err` to the final callback', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });

    stack('REQ', 'RES', function(err, res) {
      assert.equal(err, error);
      assert.equal(res, 'RES');
      done();
    });
  });
});
