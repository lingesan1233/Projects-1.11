const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");

//chain multiple requests
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.route("/").post(registerUser).get(protect, allUsers);
// router.route("/").get(protect, allUsers);
router.post("/login", authUser);
// router.route('/').get(allUsers);

module.exports = router;
