module.exports = function() {

  var stack = [];

  function run(req, res, done) {

    function next() {
      if (stack.length) {
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
