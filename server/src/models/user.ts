import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const urlRegex = /^https?:\/\/[^\s/$.?#][^\s]*$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: 'El enlace del avatar no es una URL válida',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value: string) => emailRegex.test(value),
      message: 'El correo electrónico no es válido',
    },
  },
  password: {
    type: String,
    required: true,
    // El hash no se incluye en las consultas salvo que se pida con .select('+password')
    select: false,
  },
});

const User = model<IUser>('User', userSchema);

export default User;
