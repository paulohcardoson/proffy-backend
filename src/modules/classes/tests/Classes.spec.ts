import FakeClassesRepository from "../repositories/classes/fakes/FakeClassesRepository";
import FakeProfilesRepository from "@modules/profiles/repositories/profiles/fakes/FakeProfilesRepository";
import FakeUsersRepository from "@modules/users/repositories/users/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import FindClassesService from "../services/FindClassesService";
import createFakeClass, { fakeClassData } from "./functions/createFakeClass";
import createFakeProfile from "@modules/profiles/tests/functions/createFakeProfile";
import createFakeUser from "@modules/users/tests/functions/createFakeUser";
import FakeClassesSchedulesRepository from "../repositories/classes/fakes/FakeClassesSchedulesRepository";
import CreateClassWithScheculeService from "../services/CreateClassWithScheduleService";

// Repositories
let fakeClassesRepository: FakeClassesRepository;
let fakeClassesSchedulesRepository: FakeClassesSchedulesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeProfilesRepository: FakeProfilesRepository;

// Services
let createClassWithScheculeService: CreateClassWithScheculeService;
let findClassesService: FindClassesService;

describe("Classes tests", () => {
	beforeEach(() => {
		fakeClassesRepository = new FakeClassesRepository();
		fakeClassesSchedulesRepository = new FakeClassesSchedulesRepository();
		fakeUsersRepository = new FakeUsersRepository();
		fakeProfilesRepository = new FakeProfilesRepository();

		createClassWithScheculeService = new CreateClassWithScheculeService(
			fakeProfilesRepository,
			fakeClassesRepository,
			fakeClassesSchedulesRepository,
		);
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
			createFakeClass(
				user.id,
				fakeProfilesRepository,
				fakeClassesRepository,
				fakeClassesSchedulesRepository,
			),
		).resolves.toHaveProperty("id");
	});

	it("Should not create a class - Profile doesn't exist", async () => {
		expect(
			createFakeClass(
				"non-existent-user-id",
				fakeProfilesRepository,
				fakeClassesRepository,
				fakeClassesSchedulesRepository,
			),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not create a class - Invalid schedules", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		expect(
			createClassWithScheculeService.execute({
				userId: user.id,
				...fakeClassData,
				schedule: [
					{
						week_day: 1,
						from: "08:00",
						to: "07:00",
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);

		expect(
			createClassWithScheculeService.execute({
				userId: user.id,
				...fakeClassData,
				schedule: [
					{
						week_day: 1,
						from: "08:00",
						to: "12:00",
					},
					{
						week_day: 1,
						from: "09:00",
						to: "11:00",
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);

		expect(
			createClassWithScheculeService.execute({
				userId: user.id,
				...fakeClassData,
				schedule: [
					{
						week_day: 1,
						from: "08:00",
						to: "12:00",
					},
					{
						week_day: 1,
						from: "12:00",
						to: "16:00",
					},
				],
			}),
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
			fakeClassesSchedulesRepository,
		);

		const classes = await findClassesService.execute({
			subject: fakeClassData.subject,
			time: "09:00",
			weekDay: 1,
		});

		expect(classes[0]).toHaveProperty("id");
	});
});
