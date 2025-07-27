import mongoose from "mongoose";

export interface IBlackList extends mongoose.Document {
  token: string;
  createdAt: Date;
}

const BlackListSchema: mongoose.Schema = new mongoose.Schema<IBlackList>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24 hours in seconds
});

const Blacklist = mongoose.model<IBlackList>("BlackList", BlackListSchema);

export default Blacklist;
