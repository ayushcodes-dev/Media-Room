import express from "express"
import routes from "./routes/index.js"
import connectMongoDB from "./database/mongoose/connection/main.js"
import handleconfigration from "./config/index.js"

const app = express();
const port = 3000;

/**
 * @desc  handles all configration
 */
handleconfigration()

/**
 * @desc   connecting to MongoDB using Mongoose
 */
connectMongoDB()
 
/**
 * @desc   handles incoming all routes
 */
app.use(routes)


 

app.listen(port, () => {
  console.log(`VidFly app listening on port ${port}`);
});
