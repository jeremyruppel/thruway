var subject = require('..');
var assert = require('assert');

describe('stack', function() {
  it('returns a function', function() {
    assert.equal(typeof subject(), 'function');
  });
  it('calls the the middleware with `req`, `res` and `next`', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      assert.equal(req, 'REQ');
      assert.equal(typeof res, 'function');
      assert.equal(typeof next, 'function');
      next();
    });

    stack('REQ', done);
  });
  it('calls each middleware in series', function(done) {
    var stack = subject();
    var count = 0;

    function fn(req, res, next) {
      assert.equal(req, 'REQ');
      assert.equal(typeof res, 'function');
      assert.equal(typeof next, 'function');
      count++;
      next();
    }

    stack.use(fn);
    stack.use(fn);
    stack.use(fn);

    stack('REQ', function() {
      assert.equal(count, 3);
      done();
    });
  });
  it('yields to the final callback', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      next();
    });

    stack('REQ', function(err, val) {
      assert.equal(err, null);
      assert.equal(val, undefined);
      done();
    });
  });
  it('yields `res` to the final callback', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      res(null, 'VAL');
    });

    stack('REQ', function(err, val) {
      assert.equal(err, null);
      assert.equal(val, 'VAL');
      done();
    });
  });
  it('yields `err` to the final callback', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });

    stack('REQ', function(err, val) {
      assert.equal(err, error);
      assert.equal(val, undefined);
      done();
    });
  });
  it('throws an error if res() is called twice', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      res();

      try {
        res();
      } catch (err) {
        assert.equal(err.message,
          'res() may only be called once');
        done();
      }
    });

    stack('REQ', function(){});
  });
  it('throws an error if next() is called twice', function(done) {
    var stack = subject();

    stack.use(function(req, res, next) {
      next();

      try {
        next();
      } catch (err) {
        assert.equal(err.message,
          'next() may only be called once');
        done();
      }
    });

    stack('REQ', function(){});
  });
});
