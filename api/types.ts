import { Types } from 'mongoose';

export interface UserFields {
  email: string;
  password: string;
  displayName: string;
  googleId?: string;
  token: string;
}

export interface RecipeFields {
  title: string;
  description: string;
  image: string;
  author: Types.ObjectId;
}
