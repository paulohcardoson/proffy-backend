import { inject, injectable } from "tsyringe";
import UserNotFoundError from "@shared/errors/app/UserNotFoundError";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import AppError from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";
import { IProfilesRepository } from "../repositories/profiles/IProfilesRepository";

interface IRequest {
	userId: string;
	name: string;
	phoneNumber: string;
	bio: string;
}

@injectable()
class UpdateProfileInfoService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("ProfilesRepository")
		private profilesRepository: IProfilesRepository,
	) {}

	async execute(data: IRequest) {
		const user = await this.usersRepository.findById(data.userId, {
			select: { id: true },
		});

		if (!user) {
			throw new UserNotFoundError();
		}

		if (!isValidPhoneNumber(data.phoneNumber, "BR")) {
			throw new AppError(
				"Invalid phone number. Note that only Brazil numbers (starts with +55) are allowed.",
			);
		}

		const { number: parsedPhoneNumber } = parsePhoneNumber(
			data.phoneNumber,
			"BR",
		);

		const profile = await this.profilesRepository.save({
			...data,
			phoneNumber: parsedPhoneNumber,
		});

		return profile;
	}
}

export default UpdateProfileInfoService;
