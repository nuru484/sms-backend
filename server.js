import express from 'express';
import { config } from 'dotenv';
config();

import routes from './src/routes';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome! School Management System');
});

app.use('/', routes);

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
