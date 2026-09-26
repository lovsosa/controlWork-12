import express from 'express';
import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import config from '../config';
import User from '../models/User';

const usersRouter = express.Router();
const googleClient = new OAuth2Client(config.google.clientId);

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

usersRouter.post('/google', async (req, res) => {
  if (!config.google.clientId) {
    return res.status(500).send({ error: 'Не задан GOOGLE_CLIENT_ID в api/.env' });
  }

  if (!req.body.credential) {
    return res.status(400).send({ error: 'Не передан Google credential' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).send({ error: 'Не удалось войти через Google' });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({
      $or: [{ googleId: payload.sub }, { email }],
    });

    if (!user) {
      user = new User({
        email,
        password: randomUUID(),
        displayName: payload.name || email,
      });
    }

    user.googleId = payload.sub;
    user.generateToken();
    await user.save();

    res.send(user);
  } catch {
    res.status(400).send({ error: 'Не удалось войти через Google' });
  }
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
