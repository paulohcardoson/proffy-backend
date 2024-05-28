import { Prisma, User } from "@prisma/client";
import { GetFindResult } from "@prisma/client/runtime/library";

export interface ICreateUserRequest {
	email: string;
	password: string;
}

export type TUser = User;
export type TPrismaUserRepository = Prisma.UserDelegate;
export type TUserFindUniqueSelectOrIncludeProp<
	T extends Prisma.UserFindUniqueArgs = Prisma.UserFindUniqueArgs,
> = Omit<T, "where">;
export type TUserFindUniqueResult<
	T extends TUserFindUniqueSelectOrIncludeProp,
> = GetFindResult<
	Prisma.$UserPayload,
	T & { where: Prisma.UserWhereUniqueInput }
>;
