import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    });

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    res.sendStatus(500);
  }
});

usersRouter.post('/sessions', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const user = await User.findOne({ email });

  if (!user || !(await user.checkPassword(req.body.password ?? ''))) {
    return res.status(400).send({ error: 'Email или пароль неверны' });
  }

  user.generateToken();
  await user.save();

  res.send(user);
});

usersRouter.delete('/sessions', async (req, res) => {
  try {
    const token = req.get('Authorization');

    if (!token) {
      return res.status(204).send();
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(204).send();
    }

    user.generateToken();
    await user.save();

    res.status(204).send();
  } catch {
    res.sendStatus(500);
  }
});

export default usersRouter;
