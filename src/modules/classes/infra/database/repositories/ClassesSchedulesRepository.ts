import prisma from "@shared/containers/prisma";
import { IClassesSchedulesRepository } from "@modules/classes/repositories/classes-schedules/IClassesSchedulesRepository";
import {
	ICreateClassScheduleRequest,
	ICreateManyClassScheduleRequest,
} from "@modules/classes/repositories/classes-schedules/types";

class ClassesSchedulesRepository implements IClassesSchedulesRepository {
	private repository = prisma.classSchedule;

	async create(data: ICreateClassScheduleRequest) {
		return await this.repository.create({ data: data });
	}

	async createMany(data: ICreateManyClassScheduleRequest) {
		const { classId, schedules } = data;

		await this.repository.createMany({
			data: schedules.map((schedule) => ({ classId, ...schedule })),
		});
	}

	async deleteAllByClassId(classId: string) {
		await this.repository.deleteMany({ where: { classId } });
	}
}

export default ClassesSchedulesRepository;
