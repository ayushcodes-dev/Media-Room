function handleStatus(req) {
  const data = {
    isAuthenticated: req.session?req.session.isAuthenticated :false,
    userID:req.session?req.session.userId : null,
    username:req.session?req.session.username :null,
    email: req.session?req.session.email : null,
    role: req.session?req.session.role : null,
  };

  return {
    success: true,
    message: "successfully got user data",
    statusCode: 200,
    data: data
  };
}
export default handleStatus;