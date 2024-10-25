import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // CORS paketini ekle

// Route'lar
import UserRouter from "./Routes/user.routes.js";
import ProductRouter from "./Routes/product.routes.js";
import TicketRouter from "./Routes/ticket.routes.js";
import AuthRouter from "./Routes/auth.routes.js";
import FAQRouter from "./Routes/faq.routes.js";
import EventRouter from "./Routes/event.routes.js";
import SocialRouter from "./Routes/social.routes.js";
import RectangleRouter from "./Routes/rectangle.routes.js";
import NewsRouter from "./Routes/news.routes.js";

const server = express();
dotenv.config();

// server.use(cors());
server.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // İzin ver
      } else {
        callback(new Error('Not allowed by CORS')); // İzin verme
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);


server.use(express.json());
server.use(cookieParser());

server.use("/users", UserRouter);
server.use("/products", ProductRouter);
server.use("/tickets", TicketRouter);
server.use("/auth", AuthRouter);
server.use("/faqs", FAQRouter);
server.use("/events", EventRouter);
server.use("/socials", SocialRouter);
server.use("/rectangles", RectangleRouter);
server.use("/news", NewsRouter);

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });
