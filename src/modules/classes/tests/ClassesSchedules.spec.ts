import AppError from "@shared/errors/AppError";

import FakeClassesRepository from "../repositories/classes/fakes/FakeClassesRepository";
import FakeProfilesRepository from "@modules/profiles/repositories/profiles/fakes/FakeProfilesRepository";
import FakeUsersRepository from "@modules/users/repositories/users/fakes/FakeUsersRepository";
import UpdateClassSchedulesService from "../services/UpdateClassSchedulesService";
import FakeClassesSchedulesRepository from "../repositories/classes/fakes/FakeClassesSchedulesRepository";
import createFakeProfile from "@modules/profiles/tests/functions/createFakeProfile";
import createFakeUser from "@modules/users/tests/functions/createFakeUser";
import createFakeClass from "./functions/createFakeClass";
import createFakeClassSchedule from "./functions/createFakeClassSchedule";

// Repositories
let fakeClassesRepository: FakeClassesRepository;
let fakeClassesSchedulesRepository: FakeClassesSchedulesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeProfilesRepository: FakeProfilesRepository;

// Service
let updateClassSchedulesService: UpdateClassSchedulesService;

describe("Classes Schedules tests", () => {
	beforeEach(() => {
		fakeClassesRepository = new FakeClassesRepository();
		fakeClassesSchedulesRepository = new FakeClassesSchedulesRepository();
		fakeUsersRepository = new FakeUsersRepository();
		fakeProfilesRepository = new FakeProfilesRepository();

		updateClassSchedulesService = new UpdateClassSchedulesService(
			fakeClassesSchedulesRepository,
			fakeClassesRepository,
		);
	});

	// Create class
	it("Should create a class", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		const { id } = await createFakeClass(
			user.id,
			fakeProfilesRepository,
			fakeClassesRepository,
		);

		expect(typeof id).toBe("string");
	});

	// Update schedule
	it("Should update class schedules", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		const { id: classId } = await createFakeClass(
			user.id,
			fakeProfilesRepository,
			fakeClassesRepository,
		);

		expect(
			createFakeClassSchedule(
				classId,
				fakeClassesSchedulesRepository,
				fakeClassesRepository,
			),
		).resolves.toBeUndefined();
	});

	it("Should not update class schedules - Class doesn't exist", async () => {
		expect(
			createFakeClassSchedule(
				"non-existent-class",
				fakeClassesSchedulesRepository,
				fakeClassesRepository,
			),
		).rejects.toBeInstanceOf(AppError);
	});

	it("Should not update class schedules - Invalid schedules", async () => {
		const user = await createFakeUser(fakeUsersRepository);

		await createFakeProfile(
			user.id,
			fakeUsersRepository,
			fakeProfilesRepository,
		);

		const { id: classId } = await createFakeClass(
			user.id,
			fakeProfilesRepository,
			fakeClassesRepository,
		);

		expect(
			updateClassSchedulesService.execute({
				classId,
				schedules: [
					{
						weekDay: 1,
						from: "08:00",
						to: "12:00",
					},
					{
						weekDay: 1,
						from: "09:00",
						to: "11:00",
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);

		expect(
			updateClassSchedulesService.execute({
				classId,
				schedules: [
					{
						weekDay: 1,
						from: "08:00",
						to: "12:00",
					},
					{
						weekDay: 1,
						from: "12:00",
						to: "16:00",
					},
				],
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
