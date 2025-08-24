const wrapAsync = (fn) => {
  return function (req, res, next) {
    try {
      const result = fn(req, res, next);
      if (result && result.catch) result.catch(next); // If async
    } catch (err) {
      next(err); // If sync error
    }
  };
};

module.exports = wrapAsync;