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
});
