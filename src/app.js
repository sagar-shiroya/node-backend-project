import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// TODO: explore cors params
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // to store static imaged, docs in public folder
app.use(cookieParser());

export { app };
