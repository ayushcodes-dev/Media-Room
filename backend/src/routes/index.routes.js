import express from "express"


// router
const router = express.Router();


/**
 * @route   GET /
 * @desc    Fetch public home route 
 * @access  Public
 */
router.get('/', (req, res) => {
  res.send('Hello World! ');
});
 

export default router