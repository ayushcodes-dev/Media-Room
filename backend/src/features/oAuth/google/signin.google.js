function handleGoogleSignin(req) {
  console.log("request for google signin",);
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = process.env.FRONTEND_BASE_URL + "/oAuth/callback/google";

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${client_id}` +
    `&redirect_uri=${redirect_uri}` +
    `&response_type=code` +
    `&scope=profile email` +
    `&access_type=offline`;
  return {
    success: true,
    statusCode: 200,
    message: "Google signin url generated successfully",
    data: {
      redirect_url: url,
      redirect: true,
    }
  };
}

export default handleGoogleSignin;
