import path from 'path';
import dotenv from 'dotenv';

const rootPath = __dirname;

dotenv.config({ path: path.join(rootPath, '.env'), quiet: true });

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  mongoDbUrl: 'mongodb://127.0.0.1:27017/recipes',
  google: {
    clientId: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  },
};

export default config;
