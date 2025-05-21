import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { config } from 'dotenv';

import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes/index.routes'
import { connectDatabase } from './config/database';

config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

app.listen(8080, ()=> console.log("servidor rodando!"))
