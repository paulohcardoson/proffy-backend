import { ClassSchedule } from "@prisma/client";

export type TClassSchedule = ClassSchedule;

export interface IClassSchedule {
	weekDay: number;
	from: number;
	to: number;
}

export interface ICreateClassScheduleRequest extends IClassSchedule {
	classId: string;
}

export interface ICreateManyClassScheduleRequest {
	classId: string;
	schedule: IClassSchedule[];
}
