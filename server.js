import express from 'express';
import { config } from 'dotenv';
config();
import cors from 'cors';

import routes from './src/routes';

const app = express();

const allowedOrigins = new Set(
  process.env.CORS_ACCESS ? process.env.CORS_ACCESS.split(',') : []
);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
  console.log('\x1b[34m%s\x1b[0m', ` http://localhost:${port}/`);
  console.log(`Allowed origins: ${allowedOrigins}`);
});
