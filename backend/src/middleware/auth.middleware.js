

// checks user is authenticated or not 
export const handleUserAuth_middle = (req,res,next)=>{
    const reserror = {
      success: false,
      statusCode: 401,
      message: "user is not authenticated",
      errorCode: "UNAUTHENTICATED",
      errors: null,
    };
    if (!req.session) return res.error(reserror);
    if(req.session.isAuthenticated!==true) return res.error(reserror)
   return  next()
}













