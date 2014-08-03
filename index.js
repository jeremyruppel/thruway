/**
 * Creates a new middleware stack.
 *
 * @returns {Function} run
 */
module.exports = function() {

  /**
   * The middleware stack.
   *
   * @api private
   */
  var stack = [];

  /**
   * The error handler stack.
   *
   * @api private
   */
  var error = [];

  /**
   * Whether or not an error has been passed to `next`.
   * Determines whether we're working off the middleware or
   * error handler stack.
   *
   * @api private
   */
  var threw = false;

  /**
   * Sends `req` and `res` down the middleware stack, calling
   * `done` when the current stack has been exhausted.
   */
  function run(req, res, done) {

    function nextStack(err) {
      if (err) {
        threw = true;
        next(err);
      } else if (stack.length) {
        var fn = stack.shift();
        fn(req, res, next);
      } else {
        done(null, res);
      }
    }

    function nextError(err) {
      if (!err) {
        throw new Error('Error handlers must pass an error to next()');
      } else if (error.length) {
        var fn = error.shift();
        fn(err, req, res, next);
      } else {
        done(err, res);
      }
    }

    function next(err) {
      if (!threw) {
        nextStack(err);
      } else {
        nextError(err);
      }
    }

    next();
  }

  /**
   * Adds a new middleware or error handler to the front of
   * the appropriate stack.
   *
   * @param {Function} fn
   * @returns {run} for chaining
   * @api public
   */
  run.unshift = function(fn) {
    if (fn.length === 4) {
      error.unshift(fn);
    } else {
      stack.unshift(fn);
    }
    return run;
  };

  /**
   * Adds a new middleware or error handler to the end of
   * the appropriate stack.
   *
   * @param {Function} fn
   * @returns {run} for chaining
   * @api public
   */
  run.push = function(fn) {
    if (fn.length === 4) {
      error.push(fn);
    } else {
      stack.push(fn);
    }
    return run;
  };

  /**
   * Adds a new middleware or error handler to the end of
   * the appropriate stack.
   *
   * @param {Function} fn
   * @returns {run} for chaining
   * @api public
   */
  run.use = function(fn) {
    return run.push(fn);
  };

  return run;
};
