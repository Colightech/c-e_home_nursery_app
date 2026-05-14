const mongoose = require("mongoose");
const streamifier = require("streamifier");
const fs = require("fs");
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

    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No file uploaded",
      });
    }

    const file = req.file;
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const resourceType = isVideo
      ? "video"
      : isImage
      ? "image"
      : "raw";

    // =========================
    // VIDEO UPLOAD
    // =========================

    // if (isVideo) {
    //   const result = await new Promise(
    //     (resolve, reject) => {
    //       const stream = cloudinary.uploader.upload_stream(
    //           {
    //             resource_type: "video",
    //             folder: `daycare/${req.user.daycareId}/chat/${req.user._id}`,
    //           },
    //           (error, result) => {
    //             if (error) {
    //               console.log("CLOUDINARY VIDEO ERROR:", error);
    //               return reject(error);
    //             }
    //             resolve(result);
    //           }
    //         );

    //       streamifier
    //         .createReadStream(file.buffer)
    //         .pipe(stream);
    //     }
    //   );

    //   return res.json({
    //     url: result.secure_url,
    //     fileName: file.originalname,
    //     fileType: file.mimetype,
    //     fileSize: file.size,
    //   });
    // }

   
    if (isVideo) {

      const result = await cloudinary.uploader.upload(
        file.path,
        {
          resource_type: "video",
          folder: `daycare/${req.user.daycareId}/chat/${req.user._id}`,
        }
      );

      // delete temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return res.json({
        url: result.secure_url,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
      });
    }

    // =========================
    // IMAGE / DOCUMENT
    // =========================
    const result = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: resourceType,

              folder: `daycare/${req.user.daycareId}/chat/${req.user._id}`,
              ...(isImage
                ? {
                    quality: "auto",
                    fetch_format: "auto",
                    width: 1200,
                    crop: "limit",
                  }
                : {}),
            },
            (error, result) => {
              if (error) {
                console.log( "CLOUDINARY ERROR:", error);
                return reject(error);
              }
              resolve(result);
            }
          );

        streamifier
          .createReadStream(file.buffer)
          .pipe(stream);
      }
    );

    return res.json({
      url: result.secure_url,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
    });

  } catch (error) {
    console.log("UPLOAD MEDIA ERROR:",error);
    return res.status(500).json({
      error: true,
      message: error.message || "Upload failed",
    });
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