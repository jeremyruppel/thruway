module.exports = function() {

  var stack = [];
  var error = [];
  var threw = false;

  function run(req, res, done) {

    function nextStack(err) {
      if (err) {
        threw = true;
        next(err);
      } else if (stack.length) {
        var fn = stack.shift();
        fn(req, res, next);
      } else {
        done();
      }
    }

    function nextError(err) {
      if (!err) {
        throw new Error('Error handlers must pass an error to next()');
      } else if (error.length) {
        var fn = error.shift();
        fn(err, req, res, next);
      } else {
        done(err);
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

  run.use = function(fn) {
    if (fn.length === 4) {
      error.push(fn);
    } else {
      stack.push(fn);
    }
    return run;
  };

  return run;
};
