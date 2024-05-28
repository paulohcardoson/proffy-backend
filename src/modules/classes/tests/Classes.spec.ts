import FakeClassesRepository from "../repositories/classes/fakes/FakeClassesRepository";
import FakeProfilesRepository from "@modules/profiles/repositories/profiles/fakes/FakeProfilesRepository";
import FakeUsersRepository from "@modules/users/repositories/users/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FindClassesService from "../services/FindClassesService";
import createFakeClass, { fakeClassData } from "./functions/createFakeClass";
import createFakeProfile from "@modules/profiles/tests/functions/createFakeProfile";
import createFakeUser from "@modules/users/tests/functions/createFakeUser";

// Repositories
let fakeClassesRepository: FakeClassesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeProfilesRepository: FakeProfilesRepository;

// Services
let findClassesService: FindClassesService;

describe("Classes tests", () => {
	beforeEach(() => {
		fakeClassesRepository = new FakeClassesRepository();
		fakeUsersRepository = new FakeUsersRepository();
		fakeProfilesRepository = new FakeProfilesRepository();

		findClassesService = new FindClassesService(fakeClassesRepository);
	});

	// Create class
	it("Should create a class", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		expect(
			createFakeClass(user.id, fakeProfilesRepository, fakeClassesRepository),
		).resolves.toHaveProperty("id");
	});

	it("Should not create a class - Profile doesn't exist", async () => {
		expect(
			createFakeClass(
				"non-existent-user-id",
				fakeProfilesRepository,
				fakeClassesRepository,
			),
		).rejects.toBeInstanceOf(AppError);
	});

	// Find class
	it("Should find classes", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		await createFakeClass(
			user.id,
			fakeProfilesRepository,
			fakeClassesRepository,
		);

		const classes = await findClassesService.execute({
			subject: fakeClassData.subject,
			time: "08:00",
			weekDay: 1,
		});

		expect(classes[0]).toHaveProperty("id");
	});
});
