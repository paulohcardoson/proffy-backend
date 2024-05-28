import {
	REDIS_HOST,
	REDIS_PASSWORD,
	REDIS_PORT,
	REDIS_USER,
} from "@shared/env";
import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { createClient } from "redis";

const redisClient = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
	username: REDIS_USER,
	password: REDIS_PASSWORD,
});

redisClient.connect();

const rateLimiterRedis = new RateLimiterRedis({
	storeClient: redisClient,
	points: 5,
	duration: 5,
	keyPrefix: "rate-limiter",
});

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.ip) await rateLimiterRedis.consume(req.ip);

		return next();
	} catch (err) {
		throw new AppError("Too many request, try again later.", 429);
	}
};

export default rateLimiter;
