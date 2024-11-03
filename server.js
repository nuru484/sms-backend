import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome! School Management System');
});

const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening on port ${port}`);
});
