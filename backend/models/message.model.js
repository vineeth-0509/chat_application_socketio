import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried: true
    },
    recieverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried: true
    },
    message:{
        type:String,
        required: true
    }
}, {timestamps: true})

const Message = mongoose.model("Message", messageSchema);

export default Message;