import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import FakeHashProvider from "@shared/containers/providers/HashProvider/fakes/FakeHashProvider";

export const fakeUserData = {
	email: "test@test.com",
	password: "12345678",
};

const createFakeUser = async (usersRepository: IUsersRepository) => {
	const createUserService = new CreateUserService(
		usersRepository,
		new FakeHashProvider(),
	);
	const user = await createUserService.execute(fakeUserData);

	return user;
};

export default createFakeUser;
