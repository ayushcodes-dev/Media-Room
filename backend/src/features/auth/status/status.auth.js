function handleStatus(req) {
  if (!req.session || !req.session.isAuthenticated) {
    return {
      success: false,
      message: "User is not authenticated",
      statusCode: 404,
      errorCode: "FAILED_SIGNIN",
      data: null,
    };
  }
  return {
    success: true,
    message: "User is authenticated",
    statusCode: 200,
    data: {
      isAuthenticated: req.session.isAuthenticated || false,
      username: req.session.username || null,
      email: req.session.email || null,
    },
  };
}
export default handleStatus;