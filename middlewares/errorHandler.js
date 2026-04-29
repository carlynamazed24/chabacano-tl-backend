const databaseConnectionErrorCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "PROTOCOL_CONNECTION_LOST",
]);

const isDatabaseConnectionError = (err) => {
  return (
    databaseConnectionErrorCodes.has(err?.code) ||
    (err?.fatal && ["connect", "getaddrinfo"].includes(err?.syscall))
  );
};

const errorHandler = (err, req, res, next) => {
  if (isDatabaseConnectionError(err)) {
    console.error("Database connection error", {
      code: err.code,
      syscall: err.syscall,
      hostname: err.hostname,
      fatal: err.fatal,
    });

    return res.status(503).json({
      status: "error",
      message: "Database connection unavailable. Please try again shortly.",
    });
  }

  console.error("Unhandled Error", err);
  return res.status(err.status || err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
