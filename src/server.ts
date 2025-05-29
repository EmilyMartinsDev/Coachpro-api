import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { config } from 'dotenv';
import { connectDatabase } from './config/database';
import globalRoutes from './routes';

config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', globalRoutes);


app.listen(8080, ()=> console.log("servidor rodando!"))
