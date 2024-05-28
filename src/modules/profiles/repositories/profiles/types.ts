import { Prisma, Profile } from "@prisma/client";
import { GetFindResult } from "@prisma/client/runtime/library";

export type TProfile = Profile;
export type TPrismaProfileRepository = Prisma.ProfileDelegate;
export type TProfileFindUniqueSelectOrIncludeProp<
	T extends Prisma.ProfileFindUniqueArgs = Prisma.ProfileFindUniqueArgs,
> = Omit<T, "where">;
export type TProfileFindUniqueResult<
	T extends TProfileFindUniqueSelectOrIncludeProp,
> = GetFindResult<
	Prisma.$ProfilePayload,
	T & { where: Prisma.ProfileWhereUniqueInput }
>;

export interface ICreateProfileRequest {
	userId: string;
	name: string;
	phoneNumber: string;
	bio: string;
}

export interface IUpdateAvatarRequest {
	userId: string;
	avatar: string | null;
}
