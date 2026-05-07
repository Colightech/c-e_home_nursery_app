
const express = require("express");

const uploadLimit = require("../lib/uploadLimit");
const { uploadMedia, sendMessage, getMessages, getConversation} = require("../controllers/chatController");
const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");

const router = express.Router();

router.post("/upload", protectRoute, uploadLimit.single("file"), uploadMedia);
router.post("/send-message", protectRoute, checkPermission("send_message"),   sendMessage);
router.get("/:conversationId",  protectRoute, checkPermission("view_message"),  getMessages);
router.post("/conversation", protectRoute, checkPermission("view_message"), getConversation);


module.exports = router;
