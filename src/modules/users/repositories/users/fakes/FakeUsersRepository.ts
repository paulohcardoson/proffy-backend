import { randomUUID } from "crypto";
import { IUsersRepository } from "../IUsersRepository";
import {
	ICreateUserRequest,
	TUser,
	TUserFindUniqueResult,
	TUserFindUniqueSelectOrIncludeProp,
} from "../types";

class FakeUsersRepository implements IUsersRepository {
	private repository: TUser[] = [];

	async save(data: ICreateUserRequest) {
		const userIndexOnRepository = this.repository.findIndex(
			(user) => user.email === data.email,
		);

		if (userIndexOnRepository !== -1) {
			let user = this.repository.at(userIndexOnRepository) as TUser;

			user = {
				...user,
				...data,
			};

			this.repository[userIndexOnRepository] = user;

			return user;
		}

		const user: TUser = {
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		};

		this.repository.push(user);

		return user;
	}

	async findByEmail<T extends TUserFindUniqueSelectOrIncludeProp>(
		email: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		args?: T | undefined,
	) {
		const user = this.repository.find(
			(user) => user.email === email,
		) as TUserFindUniqueResult<T>;

		return user;
	}

	async findById<T extends TUserFindUniqueSelectOrIncludeProp>(
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		args?: T | undefined,
	) {
		const user = this.repository.find(
			(user) => user.id === id,
		) as TUserFindUniqueResult<T>;

		return user;
	}

	async delete(id: string) {
		const userIndex = this.repository.findIndex((user) => user.id === id);

		if (userIndex === -1) {
			throw new Error();
		}

		const user = this.repository[userIndex] as TUser;

		this.repository.splice(userIndex);

		return user;
	}
}

export default FakeUsersRepository;
