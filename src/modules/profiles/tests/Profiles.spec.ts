import createFakeUser from "@modules/users/tests/functions/createFakeUser";
import createFakeProfile, {
	fakeProfileData,
} from "./functions/createFakeProfile";

import UpdateProfileInfoService from "../services/UpdateProfileInfoService";
import FakeUsersRepository from "@modules/users/repositories/users/fakes/FakeUsersRepository";
import FakeProfilesRepository from "../repositories/profiles/fakes/FakeProfilesRepository";
import UserNotFoundError from "@shared/errors/app/UserNotFoundError";
import AppError from "@shared/errors/AppError";
import UpdateProfileAvatarService from "../services/UpdateProfileAvatarService";
import FindProfileService from "../services/FindProfileService";
import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import FakeStorageProvider from "@shared/containers/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeDateManagerProvider from "@shared/containers/providers/DateManagerProvider/fakes/FakeDateManagerProvider";
import FakeCacheProvider from "@shared/containers/providers/CacheProvider/fakes/TestFakeCacheProvider";

// Repositories
let fakeUsersRepository: FakeUsersRepository;
let fakeProfilesRepository: FakeProfilesRepository;

// Providers
let fakeStorageProvider: FakeStorageProvider;
let fakeDateManagerProvider: FakeDateManagerProvider;
let fakeCacheProvider: FakeCacheProvider;

// Services
let findProfileService: FindProfileService;
let updateProfileInfoService: UpdateProfileInfoService;
let updateProfileAvatarService: UpdateProfileAvatarService;

describe("Profiles tests", () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeProfilesRepository = new FakeProfilesRepository();

		fakeDateManagerProvider = new FakeDateManagerProvider();
		fakeCacheProvider = new FakeCacheProvider(fakeDateManagerProvider);
		fakeStorageProvider = new FakeStorageProvider();

		findProfileService = new FindProfileService(
			fakeProfilesRepository,
			fakeCacheProvider,
		);
		updateProfileInfoService = new UpdateProfileInfoService(
			fakeUsersRepository,
			fakeProfilesRepository,
		);
		updateProfileAvatarService = new UpdateProfileAvatarService(
			fakeProfilesRepository,
			fakeStorageProvider,
		);
	});

	// Creation
	it("Should create a profile", async () => {
		const user = await createFakeUser(fakeUsersRepository);
		const profile = await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		expect(profile).toHaveProperty("id");
	});

	it("Should not create/update profile because user doesn't exist", async () => {
		expect(
			updateProfileInfoService.execute({
				...fakeProfileData,
				userId: "non-existent-user-id",
			}),
		).rejects.toBeInstanceOf(UserNotFoundError);
	});

	it("Should not create/update profile because the phone number is invalid", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			updateProfileInfoService.execute({
				...fakeProfileData,
				phoneNumber: "invalid phone number",
				userId: user.id,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	// Uploading avatar
	it("Should update profile avatar.", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		expect(
			updateProfileAvatarService.execute({
				userId: user.id,
				avatar: "photo-name",
			}),
		).resolves.toBeUndefined();
	});

	it("Should not update profile avatar because profile doesn't exist", async () => {
		expect(
			updateProfileAvatarService.execute({
				userId: "non-existent-user-id",
				avatar: null,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not update profile avatar because avatar is undefined", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		expect(
			updateProfileAvatarService.execute({
				userId: user.id,
				avatar: undefined,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should delete profile avatar", async () => {
		const deleteFileFunction = jest.spyOn(fakeStorageProvider, "deleteFile");

		const { id: userId } = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			userId,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		await updateProfileAvatarService.execute({
			userId,
			avatar: "photo.png",
		});
		await updateProfileAvatarService.execute({ userId, avatar: null });

		expect(deleteFileFunction).toHaveBeenCalled();
	});

	// Finding profile
	it("Should find profile on database", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		expect(
			findProfileService.execute({ userId: user.id }),
		).resolves.toHaveProperty("id");
	});

	it("Should find profile on database in production - Amazon S3", async () => {
		const { id: userId } = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			userId,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		await updateProfileAvatarService.execute({
			userId,
			avatar: "profile-picture",
		});

		const profile = await findProfileService.execute({ userId }, "s3");

		if (!profile.avatar) throw Error("Profile should be found.");

		expect(profile.avatar.includes("amazonaws.com")).toBe(true);
	});

	it("Should save profile on cache", async () => {
		const saveCacheFunction = jest.spyOn(fakeCacheProvider, "save");
		const { id: userId } = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			userId,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		await findProfileService.execute({ userId });

		expect(saveCacheFunction).toHaveBeenCalled();
	});

	it("Should return profile from cache", async () => {
		const recoverCacheFunction = jest.spyOn(fakeCacheProvider, "recover");
		const { id: userId } = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			userId,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		await findProfileService.execute({ userId });
		const profile = await findProfileService.execute({ userId });

		expect(recoverCacheFunction).toHaveBeenCalled();
		expect(profile).toHaveProperty("id");
	});

	it("Should find profile on database because cache has expired.", async () => {
		const findByUserIdFunction = jest.spyOn(
			fakeProfilesRepository,
			"findByUserId",
		);
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		await findProfileService.execute({ userId: user.id });

		// Skip 15 minutes
		const currentDate = new Date();
		currentDate.setMinutes(currentDate.getMinutes() + 15);
		jest.useFakeTimers().setSystemTime();

		await findProfileService.execute({ userId: user.id });

		expect(findByUserIdFunction).toHaveBeenCalled();
	});

	it("Should not find profile because profile doesn't exist", async () => {
		expect(
			findProfileService.execute({ userId: "non-existent-user-id" }),
		).rejects.toBeInstanceOf(ProfileNotFoundError);
	});
});
