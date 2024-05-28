import { NextFunction, Request, Response } from "express";
import { isHttpError, HttpError } from "http-errors";
import AppError from "../../../errors/AppError";
import { ValidationError } from "express-validation";
import { MulterError } from "multer";

const handleError = (
	err: Error,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_: NextFunction,
) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	res.status((err as any).status || (err as any).statusCode || 500);

	if (err instanceof AppError) {
		return res.json({
			status: "error",
			message: err.message,
		});
	}

	if (err instanceof ValidationError) {
		const [[details]] = Object.values(err.details);

		return res.json({
			status: "error",
			message: details!.message,
		});
	}

	if (err instanceof MulterError) {
		return res.json({
			status: "error",
			message: err.message,
		});
	}

	if (isHttpError(err)) {
		const error = err as HttpError;

		switch (error.type) {
			case "entity.parse.failed": {
				return res.status(400).json({
					status: "error",
					message: "Bad formated request.",
				});
			}
			default: {
				return res.status(400).json({
					status: "error",
					message: "Request error.",
				});
			}
		}
	}

	console.error(err);

	return res.json({
		status: "error",
		message: "Internal server error",
	});
};

export default handleError;
