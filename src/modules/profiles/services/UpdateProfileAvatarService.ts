import AppError from "@shared/errors/AppError";

import { inject, injectable } from "tsyringe";
import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import { IProfilesRepository } from "../repositories/profiles/IProfilesRepository";
import { IStorageProvider } from "@shared/containers/providers/StorageProvider/models/IStorageProvider";
import { ICacheProvider } from "@shared/containers/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
	userId: string;
	avatar?: string | null;
}

@injectable()
class UpdateProfileAvatarService {
	constructor(
		@inject("ProfilesRepository")
		private profilesRepository: IProfilesRepository,

		@inject("StorageProvider")
		private storageProvider: IStorageProvider,

		@inject("CacheProvider")
		private cacheProvider: ICacheProvider,
	) {}

	async execute({ userId, avatar }: IRequest) {
		if (typeof avatar === "undefined") {
			throw new AppError(
				"Avatar cannot be undefined. If you want to delete the avatar, set it to null instead.",
			);
		}

		const profile = await this.profilesRepository.findByUserId(userId, {
			select: { avatar: true },
		});

		if (!profile) {
			throw new ProfileNotFoundError();
		}

		// Delete old avatar
		if (profile.avatar) await this.storageProvider.deleteFile(profile.avatar);

		// Save new avatar
		if (avatar) await this.storageProvider.saveFile(avatar);

		// Update avatar
		await this.profilesRepository.updateAvatar({
			userId,
			avatar,
		});

		// Invalidate old cache
		await this.cacheProvider.invalidate(`profiles:${userId}`);
	}
}

export default UpdateProfileAvatarService;
