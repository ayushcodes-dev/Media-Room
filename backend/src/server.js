import "module-alias/register";
import express from "express";
import cors from "cors";
import dns from "dns";
import cookieParser from "cookie-parser";
import routes from "./routes/index.routes.js";
import connectMongoDB from "./database/mongoose/connection/index.connection.js";
import Handlesession from "#/middleware/session.middleware.js";
import handleconfigration from "./config/index.config.js";
import { responseHandler } from "#/middleware/response.middleware.js";

const app = express();
const port = 3000;
async function startServer() {
  /**
   * @desc  setting dns of google and cloudfare
   */
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  /**
   * @desc Enable CORS (Cross-Origin Resource Sharing)
   */
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  /**
   * @desc  handles all configration
   */
  handleconfigration();

  /**
   * @desc Enable To Read Json
   */
  app.use(express.json());
  /**
   * description : middleware to parse cookie into json
   */
  app.use(cookieParser("ayush"));
  /**
   * @desc   connecting to MongoDB using Mongoose
   */
  await connectMongoDB();
  /**
   * @desc   Middleware To Handle Session
   */
  app.use(Handlesession());

  /**
   * @desc   Handles Responses. send response in  same format
   */
  app.use(responseHandler);

  /**
   * @desc   handles incoming all routes
   */
  app.use(routes);
  // listen
  app.listen(port, () => {
    console.log(`VidFly app listening on port ${port}`);
  });
}

/**
 * @desc starting server
 */
startServer();
