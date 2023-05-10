import express from 'express';
import routes from './src/routes/index.routes';
import cors from 'cors';
import errorHandler from './src/middlewares/error';

const app = express();
const port = 3006;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use('/', routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
