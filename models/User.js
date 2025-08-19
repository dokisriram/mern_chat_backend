import { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        unique:true,
        lowercase:true,
        trim:true
    },
    password: {
        type: String
    }
}, {
    timestamps:true
})

const User = model('user', userSchema)
export default User;