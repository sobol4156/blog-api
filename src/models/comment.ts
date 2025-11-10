import { Schema, Types, model } from 'mongoose';

export interface IComment {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  content?: string;
}

const commentSchema = new Schema<IComment>({
  blogId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [1000, 'Content must be less than 1000 characters'],
  },
});

export default model<IComment>('Comment', commentSchema);
