import { inject, injectable } from "tsyringe";
import AppError from "@shared/errors/AppError";

import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";
import { IPasswordRecoveryTokensRepository } from "@modules/users/repositories/password-recovery-tokens/IPasswordRecoveryTokensRepository";
import { IHashProvider } from "@shared/containers/providers/HashProvider/models/IHashProvider";
import { IDateManagerProvider } from "@shared/containers/providers/DateManagerProvider/models/IDateManagerProvider";
import { PASSWORD_RECOVERY_TOKEN_EXPIRATION_TIME_IN_HOURS } from "@shared/env";

interface IRequest {
	token: string;
	password: string;
}

@injectable()
class ResetPasswordService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("PasswordRecoveryTokensRepository")
		private passwordRecoveryTokensRepository: IPasswordRecoveryTokensRepository,

		@inject("HashProvider")
		private hashProvider: IHashProvider,

		@inject("DateManagerProvider")
		private dateManagerProvider: IDateManagerProvider,
	) {}

	async execute(data: IRequest) {
		const response = await this.passwordRecoveryTokensRepository.findByToken(
			data.token,
		);

		if (!response) {
			throw new AppError("This email isn't associated to any account.");
		}

		const currentDate = new Date();

		const tokenCreationHours =
			this.dateManagerProvider.getTimesDifferenceInHours(
				currentDate,
				response.createdAt,
			);

		const isTokenValidYet =
			tokenCreationHours < PASSWORD_RECOVERY_TOKEN_EXPIRATION_TIME_IN_HOURS;

		if (!isTokenValidYet) {
			throw new AppError("Password recovery token already expired.");
		}

		const user = await this.usersRepository.findById(response.userId, {
			select: { email: true },
		});

		const hashedPassword = await this.hashProvider.generate(data.password);

		await this.usersRepository.save({
			email: user!.email,
			password: hashedPassword,
		});
	}
}

export default ResetPasswordService;
