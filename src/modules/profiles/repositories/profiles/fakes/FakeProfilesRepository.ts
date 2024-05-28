import {
	ICreateProfileRequest,
	IUpdateAvatarRequest,
	TProfile,
	TProfileFindUniqueResult,
	TProfileFindUniqueSelectOrIncludeProp,
} from "@modules/profiles/repositories/profiles/types";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { randomUUID } from "crypto";

class FakeProfilesRepository implements IProfilesRepository {
	private repository: TProfile[] = [];

	async save(data: ICreateProfileRequest) {
		const profile: TProfile = {
			id: randomUUID(),
			avatar: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		};

		this.repository.push(profile);

		return profile;
	}

	async updateAvatar({ userId, avatar }: IUpdateAvatarRequest) {
		const profileIndex = this.repository.findIndex(
			(profile) => profile.userId === userId,
		);

		if (profileIndex === -1) throw new Error();

		const profile = this.repository.at(profileIndex) as TProfile;

		profile.avatar = avatar;
		this.repository[profileIndex] = profile;

		return profile;
	}

	async findById<T extends TProfileFindUniqueSelectOrIncludeProp>(
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		args?: T,
	) {
		const profile = this.repository.find((_profile) => _profile.id === id);

		return profile as TProfileFindUniqueResult<T>;
	}

	async findByUserId<T extends TProfileFindUniqueSelectOrIncludeProp>(
		userId: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		args?: T,
	) {
		const profile = this.repository.find(
			(_profile) => _profile.userId === userId,
		);

		return profile as TProfileFindUniqueResult<T>;
	}
}

export default FakeProfilesRepository;
