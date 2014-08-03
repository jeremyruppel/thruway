var subject = require('..');
var assert = require('assert');

describe('error', function() {
  it('passes an error to the handler', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });

    stack('REQ', function(err) {
      assert.equal(err, error);
      done();
    });
  });
  it('does not call middleware after an error', function(done) {
    var stack = subject();
    var error = new Error('boom');
    var count = 0;

    function fn(req, res, next) {
      count++;
      next();
    }

    stack.use(fn);
    stack.use(fn);
    stack.use(function(req, res, next) {
      next(error);
    });
    stack.use(fn); // should not get called
    stack.use(fn); // should not get called

    stack('REQ', function(err) {
      assert.equal(err, error);
      assert.equal(count, 2);
      done();
    });
  });
  it('passes an error to a separate error stack', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });
    stack.use(function(err, req, res, next) {
      assert.equal(err, error);
      assert.equal(req, 'REQ');
      assert.equal(typeof res, 'function');
      assert.equal(typeof next, 'function');
      res();
    });

    stack('REQ', done);
  });
  it('skips the error stack if res()', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      res(error);
    });
    stack.use(function(err, req, res, next) {
      throw new Error('expected to skip the error stack');
    });

    stack('REQ', function(err) {
      assert.equal(err, error);
      done();
    });
  });
  it('throws an error if an error handler does not pass the error to res()', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });
    stack.use(function(err, req, res, next) {
      try {
        res();
      } catch (err) {
        assert.equal(err.message,
          'Error handlers must pass an error to res()');
        res(err);
      }
    });

    stack('REQ', function() {
      done();
    });
  });
  it('throws an error if an error handler does not pass the error to next()', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });
    stack.use(function(err, req, res, next) {
      try {
        next();
      } catch (err) {
        assert.equal(err.message,
          'Error handlers must pass an error to next()');
        done();
      }
    });

    stack('REQ', function(){});
  });
  it('throws an error if res() is called twice', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });
    stack.use(function(err, req, res, next) {
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
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });
    stack.use(function(err, req, res, next) {
      next(err);

      try {
        next(err);
      } catch (err) {
        assert.equal(err.message,
          'next() may only be called once');
        done();
      }
    });

    stack('REQ', function(){});
  });
});
