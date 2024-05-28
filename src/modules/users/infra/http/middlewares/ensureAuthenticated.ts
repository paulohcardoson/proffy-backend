import { JWT_SECRET } from "@shared/env";
import AppError from "@shared/errors/AppError";
import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const ensureAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { authorization } = req.headers;

	if (!authorization) {
		throw new AppError(
			"You need to be authenticated to access this route.",
			401,
		);
	}

	const [, token] = authorization.split(" ");

	if (!token) {
		throw new AppError("Invalid token format.", 401);
	}

	try {
		const { sub } = verify(token, JWT_SECRET) as JwtPayload;

		req.userId = sub as string;
		return next();
	} catch (err) {
		throw new AppError("Invalid token.");
	}
};

export default ensureAuthenticated;
