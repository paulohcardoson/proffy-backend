import {
	ICreateProfileRequest,
	IUpdateAvatarRequest,
	TProfile,
	TProfileFindUniqueResult,
	TProfileFindUniqueSelectOrIncludeProp,
} from "./types";

export interface IProfilesRepository {
	save: (data: ICreateProfileRequest) => Promise<TProfile>;
	updateAvatar: (data: IUpdateAvatarRequest) => Promise<TProfile>;
	findById: <T extends TProfileFindUniqueSelectOrIncludeProp>(
		id: string,
		args?: T,
	) => Promise<TProfileFindUniqueResult<T> | null>;
	findByUserId: <T extends TProfileFindUniqueSelectOrIncludeProp>(
		userId: string,
		args?: T,
	) => Promise<TProfileFindUniqueResult<T> | null>;
}
