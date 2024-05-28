import prisma from "@shared/containers/prisma";
import { Prisma } from "@prisma/client";
import {
	ICreateProfileRequest,
	IUpdateAvatarRequest,
	TProfileFindUniqueSelectOrIncludeProp,
} from "@modules/profiles/repositories/profiles/types";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";

class ProfilesRepository implements IProfilesRepository {
	private repository = prisma.profile;

	async save(data: ICreateProfileRequest) {
		const { userId } = data;

		return await this.repository.upsert({
			create: data,
			update: data,
			where: { userId },
		});
	}

	async updateAvatar({ userId, avatar }: IUpdateAvatarRequest) {
		return await this.repository.update({
			where: { userId },
			data: { avatar },
		});
	}

	async findById<T extends TProfileFindUniqueSelectOrIncludeProp>(
		id: string,
		args?: T,
	) {
		return await this.repository.findUnique({
			where: { id },
			...args,
		} as Prisma.SelectSubset<
			T & { where: Prisma.ProfileWhereUniqueInput },
			Prisma.ProfileFindUniqueArgs
		>);
	}

	async findByUserId<T extends TProfileFindUniqueSelectOrIncludeProp>(
		userId: string,
		args?: T,
	) {
		return await this.repository.findUnique({
			where: { userId },
			...args,
		} as Prisma.SelectSubset<
			T & { where: Prisma.ProfileWhereUniqueInput },
			Prisma.ProfileFindUniqueArgs
		>);
	}
}

export default ProfilesRepository;
