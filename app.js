import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors"; // CORS paketini ekle

// Route'lar
import UserRouter from "./Routes/user.routes.js";
import ProductRouter from "./Routes/product.routes.js";
import AuthRouter from "./Routes/auth.routes.js";
import FAQRouter from "./Routes/faq.routes.js";
import EventRouter from "./Routes/event.routes.js";
import SocialRouter from "./Routes/social.routes.js";
import RectangleRouter from "./Routes/rectangle.routes.js";
import NewsRouter from "./Routes/news.routes.js";
import StreamRouter from "./Routes/stream.routes.js";
import choreographerEventRouter from "./Routes/choreographerEvent.routes.js";
import ActorRouter from "./Routes/actor.routes.js";
import BasketRouter from "./Routes/basket.routes.js";
import NewsSectionRouter from "./Routes/newsSection.routes.js";
import TicketRoutes from "./Routes/ticket.routes.js";
import TableRoutes from "./Routes/table.routes.js";

const server = express();
dotenv.config();

// server.use(cors());
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

server.use("/users", UserRouter);
server.use("/products", ProductRouter);
server.use("/auth", AuthRouter);
server.use("/faqs", FAQRouter);
server.use("/api/events", EventRouter);
server.use("/socials", SocialRouter);
server.use("/rectangles", RectangleRouter);
server.use("/news", NewsRouter);
server.use("/streams", StreamRouter);
server.use("/choreographerEvents", choreographerEventRouter);
server.use("/actors", ActorRouter);
server.use("/baskets", BasketRouter);
server.use("/newsSections", NewsSectionRouter);
server.use("/api/tickets", TicketRoutes);
server.use("/api/tables", TableRoutes);

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
