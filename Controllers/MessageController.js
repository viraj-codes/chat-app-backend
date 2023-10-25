const MessageModel = require("../Models/MessageModel");

const addMessage = async(req,res)=>{
    const {chatId,senderId,text} = req.body;

    const message = new MessageModel({
        chatId,senderId,text
    });
    try{
        const result = await message.save();
        res.status(200).json(result)
    }catch(e){res.status(500).json(e)}
}


const getMessage = async(req,res)=>{

    const {chatId} = req.params;
    try{
        const result = await MessageModel.find({chatId});
        res.status(200).json(result)
    }catch(e){res.status(500).json(e)}
}

module.exports = {
    addMessage,getMessage
};