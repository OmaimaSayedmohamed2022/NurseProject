import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session'
import rateLimit from 'express-rate-limit';
import config from './src/utilites/config.js';
import logger from './src/utilites/logger.js';
import connectDB from './src/db/mongoDb.js';
import routes from './src/routes/index.js';
import {Server} from "socket.io"
import http from 'http';
// import { errorHandler } from './src/middlewares/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  morgan('combined', {
    skip: (req, res) => config.env === 'development' && res.statusCode < 400,
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
// socket server 
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


// session
app.use(session({
  secret: process.env.SESSION_SECRET || "mysecret", 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database Connection
connectDB();

// Routes

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});




// app.use(errorHandler);

export default app;
