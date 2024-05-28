import { inject, injectable } from "tsyringe";

import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import { IClassesRepository } from "../repositories/classes/IClassesRepository";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";

interface IRequest {
	userId: string;
	subject: string;
	cost: number;
}

@injectable()
class CreateClassService {
	constructor(
		@inject("ProfilesRepository")
		private profilesRepository: IProfilesRepository,

		@inject("ClassesRepository")
		private classesRepository: IClassesRepository,
	) {}

	async execute({ userId, subject, cost }: IRequest) {
		const profile = await this.profilesRepository.findByUserId(userId, {
			select: { id: true },
		});

		if (!profile) {
			throw new ProfileNotFoundError();
		}

		const fixedLengthCost = Number(cost.toFixed(2));

		const class_ = await this.classesRepository.save({
			profileId: profile.id,
			subject,
			cost: fixedLengthCost,
		});

		return class_;
	}
}

export default CreateClassService;
