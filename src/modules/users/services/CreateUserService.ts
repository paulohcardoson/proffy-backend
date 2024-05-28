import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../repositories/users/IUsersRepository";
import { IHashProvider } from "@shared/containers/providers/HashProvider/models/IHashProvider";

interface IRequest {
	email: string;
	password: string;
}

@injectable()
class CreateUserService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("HashProvider")
		private hashProvider: IHashProvider,
	) {}

	async execute({ email, password }: IRequest) {
		const alreadyExistingUser = await this.usersRepository.findByEmail(email);

		if (alreadyExistingUser) {
			throw new AppError("This email is already registered.");
		}

		const hashedPassword = await this.hashProvider.generate(password);

		const user = await this.usersRepository.save({
			email,
			password: hashedPassword,
		});

		return user;
	}
}

export default CreateUserService;
