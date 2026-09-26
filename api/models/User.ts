import mongoose, { HydratedDocument, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { UserFields } from '../types';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  email: {
    type: String,
    required: [true, 'Введите email'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный email'],
    validate: {
      validator: async function (
        this: HydratedDocument<any>,
        value: string,
      ): Promise<boolean> {
        if (!this.isModified('email')) return true;

        const user = await User.findOne({ email: value });
        return !user;
      },
      message: 'Пользователь с таким email уже зарегистрирован',
    },
  },
  password: {
    type: String,
    required: [true, 'Введите пароль'],
  },
  displayName: {
    type: String,
    required: [true, 'Введите имя'],
    trim: true,
  },
  googleId: String,
  token: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set('toJSON', {
  transform: (_, ret: Partial<UserFields>) => {
    delete ret.password;
    delete ret.googleId;
    return ret;
  },
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);
export default User;
