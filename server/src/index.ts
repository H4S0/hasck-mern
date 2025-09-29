import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { authController } from './controllers/auth-controller/controller';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { meController } from './controllers/me-controller/controller';
import { userController } from './controllers/user-controller/controller';
import { verifyToken } from './middleware/auth-middleware';

const app = express();
const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL!;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/v1/auth', authController);
app.use('/api/v1/verify', meController);
app.use('/api/v1/user', verifyToken, userController);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

app.listen(port, async () => {
  console.log(`App is running on port ${port}`);
});
