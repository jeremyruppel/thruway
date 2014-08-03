module.exports = function() {

  var stack = [];

  function run(req, res, done) {

    function next(err) {

      if (err) {
        done(err);
      } else if (stack.length) {
        var fn = stack.shift();

        fn(req, res, next);
      } else {
        done();
      }
    }

    next();
  }

  run.use = function(fn) {
    stack.push(fn);
    return run;
  };

  return run;
};
