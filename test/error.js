var subject = require('..');
var assert = require('assert');

describe('error', function() {
  it('passes an error to the handler', function(done) {
    var stack = subject();
    var error = new Error('boom');

    stack.use(function(req, res, next) {
      next(error);
    });

    stack('REQ', 'RES', function(err) {
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

    stack('REQ', 'RES', function(err) {
      assert.equal(err, error);
      assert.equal(count, 2);
      done();
    });
  });
});
