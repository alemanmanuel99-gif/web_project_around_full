import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const urlRegex =
  /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\/[\w~:/?%#[\]@!$&'()*+,;=.]*)?#?$/;

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: 'El enlace del avatar no es una URL válida',
    },
  },
});

const User = model<IUser>('User', userSchema);

export default User;