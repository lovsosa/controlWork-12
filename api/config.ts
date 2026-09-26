import path from 'path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  mongoDbUrl: 'mongodb://127.0.0.1:27017/recipes',
  google: {
    clientId:
      '843663437006-gcsqfbboudu58kd8iua4o18fok7bgejf.apps.googleusercontent.com',
  },
};

export default config;
