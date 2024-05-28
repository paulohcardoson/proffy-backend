import { inject, injectable } from "tsyringe";
import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";

import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { IConnectionsRepository } from "../repositories/connections/IConnectionsRepository";

interface IRequest {
	profileId: string;
}

@injectable()
class CreateConnectionService {
	constructor(
		@inject("ProfilesRepository")
		private profilesRepository: IProfilesRepository,

		@inject("ConnectionsRepository")
		private connectionsRepository: IConnectionsRepository,
	) {}

	async execute({ profileId }: IRequest) {
		const profile = await this.profilesRepository.findById(profileId, {
			select: { id: true },
		});

		if (!profile) {
			throw new ProfileNotFoundError();
		}

		const connection = await this.connectionsRepository.create({ profileId });

		return connection;
	}
}

export default CreateConnectionService;
