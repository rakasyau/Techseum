import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedTopics: string[];
  bookmarks: string[];
  badges: IBadge[];
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockedAt: { type: String, required: true },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 1 },
    lastActiveDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    completedTopics: { type: [String], default: [] },
    bookmarks: { type: [String], default: [] },
    badges: {
      type: [BadgeSchema],
      default: function() {
        return [
          {
            id: "first-explorer",
            name: "First Explorer",
            description: "Created your Techseum museum pass",
            icon: "beacon",
            unlockedAt: new Date().toISOString().split("T")[0],
          },
        ];
      },
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
