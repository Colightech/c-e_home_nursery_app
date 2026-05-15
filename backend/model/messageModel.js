const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "document", "contact"],
      required: true,
    },

    text: String, // for text messages

    media: {
      url: String,
      fileName: String,
      fileType: String,
      fileSize: Number,
    },

    contact: {
      name: String,
      phone: String,
    },

    status: {
      type: String,
      enum: [ "sending", "sent", "delivered", "viewed", "failed"],
      default: "sending",
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;