import UpdateClassSchedulesService from "@modules/classes/services/UpdateClassSchedulesService";
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";
import { IClassesSchedulesRepository } from "@modules/classes/repositories/classes-schedules/IClassesSchedulesRepository";

export const fakeClassScheduleData = [
	{
		from: "08:00",
		to: "12:00",
		weekDay: 1,
	},
	{
		from: "07:00",
		to: "11:00",
		weekDay: 2,
	},
];

const createFakeClassSchedule = async (
	classId: string,
	classesSchedulesRepository: IClassesSchedulesRepository,
	classesRepository: IClassesRepository,
) => {
	const createClassService = new UpdateClassSchedulesService(
		classesSchedulesRepository,
		classesRepository,
	);

	return await createClassService.execute({
		classId,
		schedules: fakeClassScheduleData,
	});
};

export default createFakeClassSchedule;
