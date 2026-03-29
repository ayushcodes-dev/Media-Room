/*import express from "express"
import routes from "./routes/index.js"
import connectMongoDB from "./database/mongoose/connection/main.js"
import env_config from "./config/env.js"

// router
const router = express.Router();

/**
 * @desc configuring .env file
 */
 
env_config()
console.log("uri",process.env.MONGO_DB_URI)
/**
 * @desc   connecting to MongoDB using Mongoose 
 */
connectMongoDB()
 
/**
 * @desc   handles incoming all routes
 */
router.use(routes)


 
export default router*/