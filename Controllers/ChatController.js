const ChatModel = require("../Models/ChatModel");


const createChat = async (req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId],
    })

    try {
        const result = await newChat.save();
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json(err);
    }
}

const userChats = async (req, res) => {
    console.log('req.params', req.params)
    try {
        const chat = await ChatModel.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(chat)
    }
    catch (err) { res.status(500).json(err); }
}


const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] }
        })
        res.status(200).json(chat)
    }
    catch (err) { res.status(500).json(err); }
}

module.exports = {
    createChat,
    userChats, findChat
};