import { Schema, model, Types } from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

const urlRegex =
  /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\/[\w~:/?%#[\]@!$&'()*+,;=.]*)?#?$/;

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: 'El enlace de la imagen no es una URL válida',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = model<ICard>('Card', cardSchema);

export default Card;