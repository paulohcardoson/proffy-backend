import AppError from "@shared/errors/AppError";
import { sign } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION_TIME } from "@shared/env";
import { inject, injectable } from "tsyringe";

import UserNotFoundError from "@shared/errors/app/UserNotFoundError";
import { IUsersRepository } from "../repositories/users/IUsersRepository";
import { IHashProvider } from "@shared/containers/providers/HashProvider/models/IHashProvider";

interface IRequest {
	email: string;
	password: string;
}

@injectable()
class CreateSessionService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("HashProvider")
		private hashProvider: IHashProvider,
	) {}

	async execute({ email, password }: IRequest) {
		const user = await this.usersRepository.findByEmail(email, {
			select: {
				id: true,
				password: true,
			},
		});

		if (!user) {
			throw new UserNotFoundError();
		}

		const passwordsMatch = await this.hashProvider.compare(
			password,
			user.password,
		);

		if (!passwordsMatch) {
			throw new AppError("Passwords don't match.");
		}

		const jwt = sign({}, JWT_SECRET, {
			subject: user.id,
			expiresIn: JWT_EXPIRATION_TIME,
		});

		return jwt;
	}
}

export default CreateSessionService;
