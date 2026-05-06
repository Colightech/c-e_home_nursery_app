const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    //Optional: tie chat to daycare
    daycareId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Daycare",
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    lastMessageAt: {
      type: Date,
    },

    // unread tracking (important for real apps)
    unreadCount: {
      type: Map,
      of: Number, // userId → count
      default: {},
    },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;