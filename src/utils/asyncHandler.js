const asyncHandler = (fun) => {
  return async (req, res, next) => {
    try {
       await fun(req, res, next);
    } catch (error) {
      res.status(err.code || 500).json({
        sucres: false,
        message: err.message,
      });
    }
  };
};
export { asyncHandler };
