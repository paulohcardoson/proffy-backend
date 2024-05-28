import { Prisma } from "@prisma/client";

import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";

import {
	ICreateUserRequest,
	TUserFindUniqueSelectOrIncludeProp,
} from "@modules/users/repositories/users/types";

import prisma from "@shared/containers/prisma";

class UsersRepository implements IUsersRepository {
	private repository = prisma.user;

	async save(data: ICreateUserRequest) {
		const { email } = data;

		return await this.repository.upsert({
			create: data,
			update: data,
			where: { email },
		});
	}

	async delete(id: string) {
		return await this.repository.delete({ where: { id } });
	}

	async findById<T extends TUserFindUniqueSelectOrIncludeProp>(
		id: string,
		args?: T,
	) {
		return await this.repository.findUnique({
			where: { id },
			...args,
		} as Prisma.SelectSubset<
			T & { where: Prisma.UserWhereUniqueInput },
			Prisma.UserFindUniqueArgs
		>);
	}

	async findByEmail<T extends Omit<Prisma.UserFindUniqueArgs, "where">>(
		email: string,
		args?: T,
	) {
		return await this.repository.findUnique({
			where: { email },
			...args,
		} as Prisma.SelectSubset<
			T & { where: Prisma.UserWhereUniqueInput },
			Prisma.UserFindUniqueArgs
		>);
	}
}

export default UsersRepository;
