import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import { inject, injectable } from "tsyringe";
import { IProfilesRepository } from "../repositories/profiles/IProfilesRepository";
import { ICacheProvider } from "@shared/containers/providers/CacheProvider/models/ICacheProvider";
import { TProfile } from "../repositories/profiles/types";
import generateAvatarURL from "@shared/utils/functions/generateAvatarURL";

interface IRequest {
	userId: string;
}

@injectable()
class FindProfileService {
	constructor(
		@inject("ProfilesRepository")
		private profilesRepository: IProfilesRepository,

		@inject("CacheProvider")
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: IRequest) {
		const profileCacheKey = `profiles:${data.userId}`;
		const cacheDataTTL = await this.cacheProvider.recoverTTL(profileCacheKey);
		const cacheData = await this.cacheProvider.recover(profileCacheKey);

		if (cacheData && cacheDataTTL > 0) {
			const parsedCacheData: TProfile = JSON.parse(cacheData);

			return parsedCacheData;
		}

		const profile = await this.readFromDatabase(data.userId);

		if (!profile) {
			throw new ProfileNotFoundError();
		}

		if (profile.avatar) {
			profile.avatar = generateAvatarURL(profile.avatar);
		}

		await this.saveOnCache(profile);

		return profile;
	}

	async readFromDatabase(userId: string) {
		const profile = await this.profilesRepository.findByUserId(userId);

		return profile;
	}

	async saveOnCache(profile: TProfile, ttlInSeconds: number = 60 * 15) {
		await this.cacheProvider.save(
			`profiles:${profile.userId}`,
			profile,
			ttlInSeconds,
		);
	}
}

export default FindProfileService;
