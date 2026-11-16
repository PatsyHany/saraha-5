import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: function () {
        return !this.attachments.length;
      },
    },
    attachments: [String],
    senderId: { type: Types.ObjectId, ref: "Users" },
    receiverId: { type: Types.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

const messageModel = mongoose.model("Messages", messageSchema);

export default messageModel;
