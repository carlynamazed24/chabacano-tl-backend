const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error", err);
  res.status(err.status || err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
