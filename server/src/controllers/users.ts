import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.js';
import { httpError } from '../utils/http-error.js';

type UserDoc = {
  _id: unknown;
  name: string;
  about: string;
  avatar: string;
  email: string;
};

// Datos públicos: lo que cualquiera puede ver de otra persona
const publicUser = (user: UserDoc) => ({
  _id: user._id,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

// Datos de la propia cuenta: incluye el correo, nunca el hash
const ownUser = (user: UserDoc) => ({
  ...publicUser(user),
  email: user.email,
});

const notFound = () => httpError(404, 'No se encontró ningún usuario con ese id');

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({});
  res.send(users.map(publicUser));
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw notFound();
  }

  if (user._id.toString() === req.user?._id) {
    res.send(ownUser(user));
    return;
  }

  res.send(publicUser(user));
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw notFound();
  }

  res.send(ownUser(user));
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    throw httpError(400, 'Los campos email y password son obligatorios');
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw httpError(400, 'Los campos email y password deben ser texto');
  }

  if (password.length < 8) {
    throw httpError(400, 'La contraseña debe tener al menos 8 caracteres');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    res.status(201).send(ownUser(user));
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      throw httpError(409, 'Ese correo electrónico ya está registrado');
    }
    throw err;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw httpError(400, 'Los campos email y password son obligatorios');
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw httpError(400, 'Los campos email y password deben ser texto');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    '+password',
  );

  if (!user) {
    throw httpError(401, 'Correo electrónico o contraseña incorrectos');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw httpError(401, 'Correo electrónico o contraseña incorrectos');
  }

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.send({ token, user: ownUser(user) });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { returnDocument: 'after', runValidators: true },
  );

  if (!user) {
    throw notFound();
  }

  res.send(ownUser(user));
};

export const updateAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { returnDocument: 'after', runValidators: true },
  );

  if (!user) {
    throw notFound();
  }

  res.send(ownUser(user));
};
