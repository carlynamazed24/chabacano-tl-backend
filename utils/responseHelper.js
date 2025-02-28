const sendResponse = {
  success: (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
      status: "success",
      message,
      data: data || [],
    });
  },

  failed: (res, message, statusCode = 400) => {
    res.status(statusCode).json({
      status: "failed",
      message,
    });
  },
};

export default sendResponse;
