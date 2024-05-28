import UpdateProfileInfoService from "@modules/profiles/services/UpdateProfileInfoService";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";

export const fakeProfileData = {
	bio: "Whatever.",
	name: "Test Profile",
	phoneNumber: "+55 (92) 999999999",
};

const createFakeProfile = async (
	userId: string,
	usersRepository: IUsersRepository,
	profilesRepository: IProfilesRepository,
) => {
	const updateProfileInfoService = new UpdateProfileInfoService(
		usersRepository,
		profilesRepository,
	);
	const profile = await updateProfileInfoService.execute({
		...fakeProfileData,
		userId,
	});

	return profile;
};

export default createFakeProfile;
