import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import UserNotFoundError from "@shared/errors/app/UserNotFoundError";
import { IUsersRepository } from "../repositories/users/IUsersRepository";
import { IHashProvider } from "@shared/containers/providers/HashProvider/models/IHashProvider";

interface IRequest {
	id: string;
	password: string;
}

@injectable()
class DeleteUserService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("HashProvider")
		private hashProvider: IHashProvider,
	) {}

	async execute({ id, password }: IRequest) {
		const user = await this.usersRepository.findById(id, {
			select: { password: true },
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

		await this.usersRepository.delete(id);
	}
}

export default DeleteUserService;
