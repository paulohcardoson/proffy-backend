import AppError from "@shared/errors/AppError";

class ProfileNotFoundError extends AppError {
	constructor() {
		super("Profile not found.");
	}
}

export default ProfileNotFoundError;
