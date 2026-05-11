
const express = require("express");

const uploadLimit = require("../lib/uploadLimit");
const { uploadMedia, sendMessage, getMessages, findConversation, getChatUsers, searchUsers} = require("../controllers/chatController");
const { protectRoute } = require("../middlewares/middleWare");
const { checkPermission } = require("../middlewares/middleware");

const router = express.Router();

router.post("/upload", protectRoute, uploadLimit.single("file"), uploadMedia);
router.post("/send-message", protectRoute, checkPermission("send_message"),   sendMessage);
router.post("/find-conversation", protectRoute, checkPermission("view_message"), findConversation);
router.get("/chat-users", protectRoute, checkPermission("view_message"), getChatUsers);
router.get("/search-users",     protectRoute, checkPermission("view_users"),    searchUsers );
router.get("/:conversationId",  protectRoute, checkPermission("view_message"),  getMessages);


module.exports = router;
