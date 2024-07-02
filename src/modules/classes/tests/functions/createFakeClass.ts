import CreateClassWithScheduleService from "@modules/classes/services/CreateClassWithScheduleService";
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { IClassesSchedulesRepository } from "@modules/classes/repositories/classes-schedules/IClassesSchedulesRepository";

export const fakeClassData = {
	subject: "Matemática",
	cost: 80,
};

export const fakeClassScheduleData = [
	{
		from: "08:00",
		to: "12:00",
		week_day: 1,
	},
	{
		from: "07:00",
		to: "11:00",
		week_day: 2,
	},
];

const createFakeClass = async (
	userId: string,
	profilesRepository: IProfilesRepository,
	classesRepository: IClassesRepository,
	classesSchedulesRepository: IClassesSchedulesRepository,
) => {
	const createClassWithScheduleService = new CreateClassWithScheduleService(
		profilesRepository,
		classesRepository,
		classesSchedulesRepository,
	);

	return await createClassWithScheduleService.execute({
		userId,
		...fakeClassData,
		schedule: fakeClassScheduleData,
	});
};

export default createFakeClass;
