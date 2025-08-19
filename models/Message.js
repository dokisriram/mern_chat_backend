import { Schema, Model, model } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
    message: {
        type: String
    }
}, {
    timestamps: true
})

const Message = model('message', messageSchema)
export default Message;