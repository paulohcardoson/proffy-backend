import AppError from "@shared/errors/AppError";

class ClassNotFoundError extends AppError {
	constructor() {
		super("Class not found.");
	}
}

export default ClassNotFoundError;
