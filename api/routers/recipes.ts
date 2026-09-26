import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { promises as fs } from 'node:fs';
import config from '../config';
import auth, { RequestWithUser } from '../middlewares/auth';
import { imagesUpload } from '../multer';
import Recipe from '../models/Recipe';
import Comment from '../models/Comment';

const recipesRouter = express.Router();

const removeImage = async (image?: string) => {
  if (!image || !image.startsWith('images/')) return;
  await fs.unlink(path.join(config.publicPath, image)).catch(() => undefined);
};

recipesRouter.get('/', async (req, res) => {
  try {
    const author = req.query.author as string | undefined;

    if (author && !mongoose.isValidObjectId(author)) {
      return res.send([]);
    }

    const recipes = await Recipe.find(author ? { author } : {}, 'title image author')
      .populate('author', 'displayName')
      .sort({ createdAt: -1 });

    res.send(recipes);
  } catch {
    res.sendStatus(500);
  }
});

recipesRouter.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send({ error: 'Рецепт не найден' });
    }

    const recipe = await Recipe.findById(req.params.id).populate('author', 'displayName');

    if (!recipe) {
      return res.status(404).send({ error: 'Рецепт не найден' });
    }

    res.send(recipe);
  } catch {
    res.sendStatus(500);
  }
});

recipesRouter.post('/', auth, imagesUpload.single('image'), async (req, res) => {
  const user = (req as RequestWithUser).user;
  const image = req.file ? 'images/' + req.file.filename : undefined;

  try {
    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      image,
      author: user._id,
    });

    await recipe.save();

    res.send(recipe);
  } catch (e) {
    await removeImage(image);

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    res.sendStatus(500);
  }
});

recipesRouter.delete('/:id', auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send({ error: 'Рецепт не найден' });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).send({ error: 'Рецепт не найден' });
    }

    if (!recipe.author.equals(user._id)) {
      return res.status(403).send({ error: 'Удалить рецепт может только его автор' });
    }

    await recipe.deleteOne();
    await Comment.deleteMany({ recipe: recipe._id });
    await removeImage(recipe.image);

    res.send({ message: 'Рецепт удалён' });
  } catch {
    res.sendStatus(500);
  }
});

export default recipesRouter;
