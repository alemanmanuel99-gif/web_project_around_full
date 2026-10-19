import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Card from '../models/cards.js';
import { httpError } from '../utils/http-error.js';

type CardLike = {
  toObject: () => object;
  likes: { toString: () => string }[];
};

const withIsLiked = (card: CardLike, userId?: string) => ({
  ...card.toObject(),
  isLiked: card.likes.some((id) => id.toString() === userId),
});

// Busca la tarjeta y comprueba, en este orden, que exista (404) y que sea de quien la pide (403)
const findOwnCard = async (req: Request, forbiddenMessage: string) => {
  const card = await Card.findById(req.params.id);

  if (!card) {
    throw httpError(404, 'No se encontró ninguna tarjeta con ese id');
  }

  if (card.owner.toString() !== req.user?._id) {
    throw httpError(403, forbiddenMessage);
  }

  return card;
};

export const getCards = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw httpError(401, 'No autorizado');
  }

  const cards = await Card.find({ owner: userId }).sort({ createdAt: -1 });

  res.send(cards.map((card) => withIsLiked(card, userId)));
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  if (!owner) {
    throw httpError(401, 'No autorizado');
  }

  const card = await Card.create({ name, link, owner });
  res.status(201).send({ ...card.toObject(), isLiked: false });
};

export const deleteCard = async (req: Request, res: Response) => {
  const card = await findOwnCard(req, 'No puedes eliminar una tarjeta que no es tuya');

  await card.deleteOne();

  res.send({ message: 'Tarjeta eliminada correctamente' });
};

export const likeCard = async (req: Request, res: Response) => {
  const card = await findOwnCard(
    req,
    'No puedes cambiar los "me gusta" de una tarjeta que no es tuya',
  );
  const userId = req.user?._id;

  if (userId && !card.likes.some((id) => id.toString() === userId)) {
    card.likes.push(new Types.ObjectId(userId));
    await card.save();
  }

  res.send(withIsLiked(card, userId));
};

export const dislikeCard = async (req: Request, res: Response) => {
  const card = await findOwnCard(
    req,
    'No puedes cambiar los "me gusta" de una tarjeta que no es tuya',
  );
  const userId = req.user?._id;

  card.likes = card.likes.filter((id) => id.toString() !== userId);
  await card.save();

  res.send(withIsLiked(card, userId));
};
