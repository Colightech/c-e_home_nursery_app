const conversationModel = require("../model/conversationModel");
const messageModel = require("../model/messageModel");
const cloudinary = require("../lib/cloudinary");




// find existing or create new
const getOrCreateConversation = async (user1, user2) => {
  let convo = await conversationModel.findOne({
    participants: { $all: [user1, user2], $size: 2 },
  });

  if (!convo) {
    convo = await conversationModel.create({
      participants: [user1, user2],
    });
  }

  return convo;
};




const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, messageType, media } = req.body;

    if (!receiverId || !messageType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const convo = await getOrCreateConversation(req.user.id, receiverId);

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

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "receiverId required",
      });
    }

    const convo = await getOrCreateConversation(
      req.user.id,
      receiverId
    );

    res.json(convo);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await messageModel.find({ conversationId })
        .sort({ createdAt: 1 })
        .populate("sender", "firstName lastName");

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
    uploadMedia,
    getConversation
}