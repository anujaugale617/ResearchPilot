import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: null },
  },
  { timestamps: true },
);
schema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    createdAt: this.createdAt,
  };
};
export const User = mongoose.model("User", schema);
