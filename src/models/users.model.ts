import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const usersModel = mongoose.model("users", usersSchema);

export default usersModel;
