export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
}

export interface GlobalError {
  error: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
}

export interface Author {
  _id: string;
  displayName: string;
}

export interface Recipe {
  _id: string;
  title: string;
  image: string;
  author: Author;
}

export interface RecipeFull extends Recipe {
  description: string;
  createdAt: string;
}

export interface RecipeMutation {
  title: string;
  description: string;
  image: File | null;
}
