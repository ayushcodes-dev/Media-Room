
async function handleSignout(req) {
    return new Promise((resolve, reject) => {
    const response = {
      success: false,
      statusCode: 500,
      message: "Failed to sign out",
      errorCode: `FAILED_SIGNOUT`,
      errors: null,
    };
  req.session.destroy((err) => {

    
    if (err) {
     resolve(response)
    } else {
      response.success = true;
      response.statusCode = 200;
      response.message = "Successfully signed out";
      response.errorCode = null;
      response.errors = null;
      resolve(response);
    }
  });
  
//   return response;
    });
}
export default handleSignout;