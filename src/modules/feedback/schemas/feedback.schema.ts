import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

// Tự động thêm createdAt, updatedAt
@Schema({
  timestamps: true,
  // toJSON: {
  //   virtuals: true,
  //   versionKey: false,
  //   transform: (_doc, ret) => {
  //     ret._id = ret._id.toString();
  //   },
  // },
})
export class Feedback {
  @Transform(({ value }): string => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  rating: number;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
