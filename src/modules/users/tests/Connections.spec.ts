import FakeUsersRepository from "@modules/users/repositories/users/fakes/FakeUsersRepository";
import FakeConnectionsRepository from "@modules/users/repositories/connections/fakes/FakeConnectionsRepository";
import FakeProfilesRepository from "@modules/profiles/repositories/profiles/fakes/FakeProfilesRepository";
import CreateConnectionService from "../services/CreateConnectionService";
import CountConnectionsService from "../services/CountConnectionsService";
import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import createFakeUser from "./functions/createFakeUser";
import createFakeProfile from "@modules/profiles/tests/functions/createFakeProfile";
import FakeCacheProvider from "@shared/containers/providers/CacheProvider/fakes/TestFakeCacheProvider";
import FakeDateManagerProvider from "@shared/containers/providers/DateManagerProvider/fakes/FakeDateManagerProvider";

// Repositories
let fakeUsersRepository: FakeUsersRepository;
let fakeProfilesRepository: FakeProfilesRepository;
let fakeConnectionsRepository: FakeConnectionsRepository;

// Services
let createConnectionService: CreateConnectionService;
let countConnectionsService: CountConnectionsService;

// Providers
let fakeDateManagerProvider: FakeDateManagerProvider;
let fakeCacheProvider: FakeCacheProvider;

describe("Connections Tests", () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeProfilesRepository = new FakeProfilesRepository();
		fakeConnectionsRepository = new FakeConnectionsRepository();

		fakeDateManagerProvider = new FakeDateManagerProvider();
		fakeCacheProvider = new FakeCacheProvider(fakeDateManagerProvider);

		createConnectionService = new CreateConnectionService(
			fakeProfilesRepository,
			fakeConnectionsRepository,
		);
		countConnectionsService = new CountConnectionsService(
			fakeConnectionsRepository,
			fakeCacheProvider,
		);
	});

	it("Should create a connection", async () => {
		const user = await createFakeUser(fakeUsersRepository);
		const profile = await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		const connection = await createConnectionService.execute({
			profileId: profile.id,
		});

		expect(connection).toHaveProperty("id");
	});

	it("Should not create a connection because profile doesn't exist", async () => {
		await createFakeUser(fakeUsersRepository);

		expect(
			createConnectionService.execute({
				profileId: "non-existent-profile-id",
			}),
		).rejects.toBeInstanceOf(ProfileNotFoundError);
	});

	it("Should count all connections on database.", async () => {
		const connectionsAmount = await countConnectionsService.execute();

		expect(typeof connectionsAmount).toBe("number");
	});

	it("Should save connection count on cache", async () => {
		const saveCacheFunction = jest.spyOn(fakeCacheProvider, "save");

		await countConnectionsService.execute();

		expect(saveCacheFunction).toHaveBeenCalled();
	});

	it("Should return connection count from cache.", async () => {
		const recoverCacheFunction = jest.spyOn(fakeCacheProvider, "recover");

		await countConnectionsService.execute();
		await countConnectionsService.execute();

		expect(recoverCacheFunction).toHaveBeenCalled();
	});

	it("Should count all connections on database because cache has expired.", async () => {
		await countConnectionsService.execute();

		// Skip in 1 hour
		const currentDate = new Date();
		currentDate.setHours(currentDate.getHours() + 1);
		jest.useFakeTimers().setSystemTime(currentDate);

		const connectionsAmount = await countConnectionsService.execute();

		expect(typeof connectionsAmount).toBe("number");
	});
});
