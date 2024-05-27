exports.genericErrorHandler = (err, req, res, next) => {
  //console.log(err);
    return res.status(err.statusCode || 500).json({
      message: err.message || "An error occurred",
      error: err,
    });
}