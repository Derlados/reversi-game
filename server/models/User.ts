import mongoose from "mongoose";
const User = new mongoose.Schema({
    googleId: { type: Number, required: true },
    username: { type: String, required: true },
})

export default mongoose.model('User', User);