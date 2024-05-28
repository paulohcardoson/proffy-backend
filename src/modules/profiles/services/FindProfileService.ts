import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import { inject, injectable } from "tsyringe";
import { IProfilesRepository } from "../repositories/profiles/IProfilesRepository";
import { ICacheProvider } from "@shared/containers/providers/CacheProvider/models/ICacheProvider";
import { TProfile } from "../repositories/profiles/types";
import {
	APP_SERVER_HOST,
	APP_SERVER_PORT,
	S3_BUCKET_NAME,
	S3_BUCKET_REGION,
	STORAGE_DRIVER,
} from "@shared/env";

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

	async execute(data: IRequest, storageDriver = STORAGE_DRIVER) {
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

		switch (storageDriver) {
			case "disk": {
				profile.avatar = `${APP_SERVER_HOST}:${APP_SERVER_PORT}/static/${profile.avatar}`;
				break;
			}
			case "s3": {
				profile.avatar = `https://${S3_BUCKET_NAME}.s3.${S3_BUCKET_REGION}.amazonaws.com/${profile.avatar}`;
				break;
			}
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
