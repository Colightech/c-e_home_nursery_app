const mongoose = require("mongoose");
const conversationModel = require("../model/conversationModel");
const messageModel = require("../model/messageModel");
const cloudinary = require("../lib/cloudinary");
const usersModel = require("../model/usersModel");





// find existing or create new
const getOrCreateConversation = async ( user1, user2 ) => {
    try {
      if (!user1 || !user2) {
        throw new Error(
          "Both users are required"
        );
      }
      // normalize ids
      const user1Id = new mongoose.Types.ObjectId(user1);
      const user2Id = new mongoose.Types.ObjectId(user2);

      // find existing convo
      let convo = await conversationModel.findOne({
          participants: {
            $all: [user1Id, user2Id],
            $size: 2,
          },
      });

      // create if not existing
      if (!convo) {
        convo = await conversationModel.create({
            participants: [
              user1Id,
              user2Id,
            ],
        });
      }

      return convo;

    } catch (error) {
      console.log( "getOrCreateConversation error", error.message);
      throw error;
    }
};



const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, messageType, media } = req.body;

    if (!receiverId || !messageType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const convo = await getOrCreateConversation(req.user._id, receiverId);

    const message = await messageModel.create({
      conversationId: convo._id,
      sender: req.user.id,
      messageType,
      text: messageType === "text" ? text : undefined,
      media: ["image", "video", "document"].includes(messageType)
        ? media
        : undefined,
    });

    convo.lastMessage = message._id;
    convo.lastMessageAt = new Date();

    await convo.save();

    res.status(201).json({
      message,
      conversationId: convo._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const searchUsers = async ( req, res ) => {
  try {
    const search = String( req.query.search || "").trim();
    if (!search) {
      return res.json([]);
    }
    const users = await usersModel.find({
        _id: {
          $ne: req.user._id,
        },
        $or: [
          {
            firstName: {
              $regex: search,
              $options: "i",
            },
          },

          {
            lastName: {
              $regex: search,
              $options: "i",
            },
          },

          {
            email: {
              $regex: search,
              $options: "i",
            },
          },

        ],
      }).select("-password");
    return res.json(users);

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });

  }
};



// const getChatUsers = async (req, res) => {
//   try {

//     const myId = req.user.id;

//     // get all conversations involving current user
//     const conversations = await conversationModel.find({
//       participants: myId,
//     }).sort({ updatedAt: -1 });

//     // extract other users ids
//     const userIds = conversations.map((convo) => {
//       const otherUser = convo.participants.find(
//         (id) => id.toString() !== myId.toString()
//       );
//       return otherUser;
//     });

//     // remove duplicates
//     const uniqueUserIds = [...new Set(userIds.map((id) => id.toString()))];

//     // fetch users
//     const users = await usersModel.find({
//       _id: { $in: uniqueUserIds },
//     }).select("-password");

//     // attach conversationId
//     const formattedUsers = users.map((user) => {

//       const convo = conversations.find((c) =>
//         c.participants.some(
//           (id) => id.toString() === user._id.toString()
//         )
//       );

//       return {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role,
//         profilePicture: user.profilePicture,
//         conversationId: convo?._id,
//         updatedAt: convo?.updatedAt,
//         lastMessage: convo?.lastMessage,
//       };
//     });

//     return res.status(200).json(formattedUsers);

//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       message: error.message,
//     });
//   }
// };



const getChatUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // find all conversations where user participates
    const conversations = await conversationModel
      .find({ participants: userId })
      .populate("participants", "firstName lastName profilePicture role");

    // extract "other users"
    const chatUsers = conversations.map((convo) => {
      return convo.participants.find(
        (p) => p._id.toString() !== userId
      );
    });

    res.json(chatUsers.filter(Boolean));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// const getConversation = async (req, res) => {
//   try {
//     const { receiverId } = req.body;

//     if (!receiverId) {
//       return res.status(400).json({
//         message: "receiverId required",
//       });
//     }

//     const convo = await getOrCreateConversation(
//       req.user._id,
//       receiverId
//     );

//     res.json(convo);

//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };




const findConversation = async (req, res) => {
  try {

    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "receiverId required",
      });
    }

    const convo = await conversationModel.findOne({
      participants: {
        $all: [req.user._id, receiverId],
        $size: 2,
      },
    });

    if (!convo) {
      return res.json(null);
    }

    res.json(convo);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};





const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await messageModel.find({ conversationId })
        .sort({ createdAt: 1 })
        .populate("sender", "_id firstName lastName");

        if (!messages) {
            return res.status(403).json({
                error: true,
                message: "message not found"
            })
        }
        res.json(messages);
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        })
    }
};





const uploadMedia = async (req, res) => {
  try {
    // Check file exists
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // Validate file type (🔥 MUST be here)
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "video/mp4",
        "application/pdf",
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 

        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 

        "text/plain", // .txt
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          // Folder structure (VERY IMPORTANT)
          folder: `daycare/${req.user.daycareId}/chat/${req.user.id}`,
          //Optimization
          quality: "auto",
          fetch_format: "auto",
          //Resize (prevents huge images)
          width: 800,
          crop: "limit",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    //  Return structured media object
    res.json({
      url: result.secure_url,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = {
    sendMessage,
    getMessages,
    searchUsers,
    getChatUsers,
    uploadMedia,
    findConversation,
}