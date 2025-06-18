import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String, required: true},
    email:{type:String, required: true},
    password:{type:String, required: true},
    profilepicture:{type:String},
}, {timestamps: true})


export const usermodel = models.user_collection || model("user_collection", userSchema);
