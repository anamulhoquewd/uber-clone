import mongoose, { Schema, Document } from "mongoose";

export interface IBlackList extends Document {
  token: string;
  createdAt: Date;
}

const BlackListSchema: Schema = new Schema<IBlackList>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours in seconds
});

const Blacklist = mongoose.model<IBlackList>("BlackList", BlackListSchema);

export default Blacklist;
