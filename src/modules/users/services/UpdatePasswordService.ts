import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../repositories/users/IUsersRepository";
import { IHashProvider } from "@shared/containers/providers/HashProvider/models/IHashProvider";
import UserNotFoundError from "@shared/errors/app/UserNotFoundError";
import AppError from "@shared/errors/AppError";

interface IRequest {
	userId: string;
	oldPassword: string;
	newPassword: string;
}

@injectable()
class UpdatePasswordService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("HashProvider")
		private hashProvider: IHashProvider,
	) {}

	async execute({ userId, oldPassword, newPassword }: IRequest) {
		const user = await this.usersRepository.findById(userId, {
			select: {
				id: true,
				email: true,
				password: true,
			},
		});

		if (!user) {
			throw new UserNotFoundError();
		}

		const oldPasswordMatch = await this.hashProvider.compare(
			oldPassword,
			user.password,
		);

		if (!oldPasswordMatch) {
			throw new AppError("Incorrect old passwords.");
		}

		if (oldPassword === newPassword) {
			throw new AppError("The passwords cannot be the same.");
		}

		const hashedNewPassword = await this.hashProvider.generate(newPassword);

		await this.usersRepository.save({
			email: user.email,
			password: hashedNewPassword,
		});
	}
}

export default UpdatePasswordService;
