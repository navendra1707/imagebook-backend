import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from 'cors';
import cloudinary from 'cloudinary';
import session from "express-session";
import connectMongoSession from 'connect-mongodb-session';
dotenv.config();

import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

const MongoDBStore = connectMongoSession(session);
const MAX_AGE = 1000 * 60 * 60; //1 day

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions',
})

app.use(express.json()); 
app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: MAX_AGE,
    sameSite: false,
  }
}))
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/', (req, res) => {
  res.status(200).json({
    message: 'server started'
  })
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started. Connected to MongoDB`);
    });
  })
  .catch((err) => {
    console.log(`${err}, did not connect.`);
  });
