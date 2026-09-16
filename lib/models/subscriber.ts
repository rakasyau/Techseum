import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    source: { type: String, default: "footer" },
    locale: { type: String, enum: ["en", "id"], default: "en" },
    syncedToProvider: { type: Boolean, default: false },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type SubscriberDoc = InferSchemaType<typeof subscriberSchema>;

export const Subscriber: Model<SubscriberDoc> =
  (models.Subscriber as Model<SubscriberDoc>) ||
  model<SubscriberDoc>("Subscriber", subscriberSchema);
