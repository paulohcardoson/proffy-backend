import { IClassesSchedulesRepository } from "@modules/classes/repositories/classes-schedules/IClassesSchedulesRepository";
import {
	ICreateClassScheduleRequest,
	ICreateManyClassScheduleRequest,
	TClassSchedule,
} from "@modules/classes/repositories/classes-schedules/types";
import { randomUUID } from "crypto";

class FakeClassesSchedulesRepository implements IClassesSchedulesRepository {
	private repository: TClassSchedule[] = [];

	async create(data: ICreateClassScheduleRequest) {
		const classSchedule: TClassSchedule = {
			id: randomUUID(),
			updatedAt: new Date(),
			createdAt: new Date(),
			...data,
		};

		this.repository.push(classSchedule);

		return classSchedule;
	}

	async createMany(data: ICreateManyClassScheduleRequest) {
		const { classId, schedules } = data;

		schedules.map((schedule) => {
			this.repository.push({
				id: randomUUID(),
				classId,
				updatedAt: new Date(),
				createdAt: new Date(),
				...schedule,
			});
		});
	}

	async deleteAllByClassId(classId: string) {
		const schedulesToRemove = this.repository.filter(
			(schedule) => schedule.classId === classId,
		);

		schedulesToRemove.map((schedule, index) => {
			this.repository.splice(index);
		});
	}
}

export default FakeClassesSchedulesRepository;
