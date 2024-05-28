import "express-async-errors";
import "reflect-metadata";

import express from "express";
import cors from "cors";
import appRouter from "./routes";

import handleError from "./middlewares/handleError";
import rateLimiter from "./middlewares/rateLimiter";

// Dependency Injection
import "@shared/containers";

// Env
import { APP_SERVER_PORT } from "@shared/env";

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use(appRouter);
app.use(handleError);

app.listen(APP_SERVER_PORT, () => {
	console.log(`Listening to port ${APP_SERVER_PORT}`);
});
