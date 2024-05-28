import { ClassSchedule } from "@prisma/client";
import {
	ICreateClassScheduleRequest,
	ICreateManyClassScheduleRequest,
} from "./types";

export type TClassSchedule = ClassSchedule;

export interface IClassesSchedulesRepository {
	create: (data: ICreateClassScheduleRequest) => Promise<TClassSchedule>;
	createMany: (data: ICreateManyClassScheduleRequest) => Promise<void>;
	deleteAllByClassId: (classId: string) => Promise<void>;
}
