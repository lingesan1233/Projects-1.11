const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addParticipant,
  kickParticipant,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/kick").put(protect, kickParticipant);
router.route("/add").put(protect, addParticipant);

module.exports = router;
