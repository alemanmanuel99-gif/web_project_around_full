import type { Request, Response } from 'express';
import Card from '../models/cards.js';

export const getCards = async (req: Request, res: Response) => {
  const cards = await Card.find({});
  const userId = req.user?._id;

  const cardsWithIsLiked = cards.map((card) => ({
    ...card.toObject(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  }));

  res.send(cardsWithIsLiked);
};

export const createCard = async (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  if (!owner) {
    throw Object.assign(new Error('No autorizado'), {
      statusCode: 401,
    });
  }

  const card = await Card.create({ name, link, owner });
  res.status(201).send({ ...card.toObject(), isLiked: false });
};

export const deleteCard = async (req: Request, res: Response) => {
  const card = await Card.findByIdAndDelete(req.params.id);

  if (!card) {
    throw Object.assign(new Error('No se encontró ninguna tarjeta con ese id'), {
      statusCode: 404,
    });
  }

  res.send({ message: 'Tarjeta eliminada correctamente' });
};

export const likeCard = async (req: Request, res: Response) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  );

  if (!card) {
    throw Object.assign(new Error('No se encontró ninguna tarjeta con ese id'), {
      statusCode: 404,
    });
  }

  const userId = req.user?._id;
  res.send({
    ...card.toObject(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  });
};

export const dislikeCard = async (req: Request, res: Response) => {
  const card = await Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user?._id } },
    { new: true },
  );

  if (!card) {
    throw Object.assign(new Error('No se encontró ninguna tarjeta con ese id'), {
      statusCode: 404,
    });
  }

  const userId = req.user?._id;
  res.send({
    ...card.toObject(),
    isLiked: card.likes.some((id) => id.toString() === userId),
  });
};