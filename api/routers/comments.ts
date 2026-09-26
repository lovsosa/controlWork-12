import express from 'express';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middlewares/auth';
import Comment from '../models/Comment';
import Recipe from '../models/Recipe';

const commentsRouter = express.Router();

commentsRouter.get('/', async (req, res) => {
  try {
    const recipe = req.query.recipe as string | undefined;

    if (!recipe || !mongoose.isValidObjectId(recipe)) {
      return res.status(400).send({ error: 'Не указан рецепт' });
    }

    const comments = await Comment.find({ recipe })
      .populate('author', 'displayName')
      .sort({ createdAt: 1 });

    res.send(comments);
  } catch {
    res.sendStatus(500);
  }
});

commentsRouter.post('/', auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  try {
    if (!mongoose.isValidObjectId(req.body.recipe)) {
      return res.status(404).send({ error: 'Рецепт не найден' });
    }

    const recipe = await Recipe.findById(req.body.recipe);

    if (!recipe) {
      return res.status(404).send({ error: 'Рецепт не найден' });
    }

    const comment = new Comment({
      text: req.body.text,
      author: user._id,
      recipe: recipe._id,
    });

    await comment.save();
    await comment.populate('author', 'displayName');

    res.send(comment);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    res.sendStatus(500);
  }
});

commentsRouter.delete('/:id', auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).send({ error: 'Комментарий не найден' });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).send({ error: 'Комментарий не найден' });
    }

    const recipe = await Recipe.findById(comment.recipe, 'author');
    const isCommentAuthor = comment.author.equals(user._id);
    const isRecipeOwner = Boolean(recipe && recipe.author.equals(user._id));

    if (!isCommentAuthor && !isRecipeOwner) {
      return res.status(403).send({
        error: 'Удалить комментарий может его автор или владелец рецепта',
      });
    }

    await comment.deleteOne();

    res.send({ message: 'Комментарий удалён' });
  } catch {
    res.sendStatus(500);
  }
});

export default commentsRouter;
