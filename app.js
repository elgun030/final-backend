import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";

// Routes
//user
import UserRouter from "./Routes/user.routes.js";
//product
import ProductRouter from "./Routes/product.routes.js";
//auth
import AuthRouter from "./Routes/auth.routes.js";
//faq
import FAQRouter from "./Routes/faq.routes.js";
//rectangle
import RectangleRouter from "./Routes/rectangle.routes.js";
//news
import NewsRouter from "./Routes/news.routes.js";
//stream
import StreamRouter from "./Routes/stream.routes.js";
//choreographerEvent
import choreographerEventRouter from "./Routes/choreographerEvent.routes.js";
//actor
import ActorRouter from "./Routes/actor.routes.js";
//basket
import BasketRouter from "./Routes/basket.routes.js";
//newsSection
import NewsSectionRouter from "./Routes/newsSection.routes.js";
//event
import movieRouter from "./Routes/event.routes.js";
//booking
import bookingRoutes from "./Routes/booking.routes.js";
//gallery
import galleryRoutes from "./Routes/gallery.routes.js";

const server = express();
dotenv.config();

server.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

server.use(express.json());
server.use(cookieParser());

//user
server.use("/users", UserRouter);
//product
server.use("/products", ProductRouter);
//auth
server.use("/auth", AuthRouter);
//faqs
server.use("/faqs", FAQRouter);
//rectangle
server.use("/rectangles", RectangleRouter);
//news
server.use("/news", NewsRouter);
//streams
server.use("/streams", StreamRouter);
//choreographer
server.use("/choreographerEvents", choreographerEventRouter);
//actors
server.use("/actors", ActorRouter);
//baskets
server.use("/baskets", BasketRouter);
//newsSection
server.use("/newsSections", NewsSectionRouter);
//event
server.use("/movie", movieRouter);
//booking
server.use("/booking", bookingRoutes);
//gallery
server.use("/gallery", galleryRoutes);

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
