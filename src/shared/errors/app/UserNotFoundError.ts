import AppError from "@shared/errors/AppError";

class UserNotFoundError extends AppError {
	constructor() {
		super("User not found.");
	}
}

export default UserNotFoundError;
