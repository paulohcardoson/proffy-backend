import {
	ICreateUserRequest,
	TUser,
	TUserFindUniqueResult,
	TUserFindUniqueSelectOrIncludeProp,
} from "./types";

export interface IUsersRepository {
	save: (data: ICreateUserRequest) => Promise<TUser>;
	delete: (id: string) => Promise<TUser>;
	findById: <T extends TUserFindUniqueSelectOrIncludeProp>(
		id: string,
		args?: T,
	) => Promise<TUserFindUniqueResult<T> | null>;
	findByEmail: <T extends TUserFindUniqueSelectOrIncludeProp>(
		email: string,
		args?: T,
	) => Promise<TUserFindUniqueResult<T> | null>;
}
