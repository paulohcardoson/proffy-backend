import { Class, Prisma } from "@prisma/client";
import { GetFindResult } from "@prisma/client/runtime/library";
import { TClassSchedule } from "../classes-schedules/types";

export type TClass = Class;
export type TPrismaClassRepository = Prisma.ClassDelegate;

export type TClassFindUniqueSelectOrIncludeProp<
	T extends Prisma.ClassFindUniqueArgs = Prisma.ClassFindUniqueArgs,
> = Omit<T, "where">;
export type TClassFindUniqueResult<
	T extends TClassFindUniqueSelectOrIncludeProp,
> = GetFindResult<
	Prisma.$ClassPayload,
	T & { where: Prisma.ClassWhereUniqueInput }
>;

export type TClassFindManySelectOrIncludeProp<
	T extends Prisma.ClassFindManyArgs = Prisma.ClassFindManyArgs,
> = Omit<T, "where">;
export type TClassFindManyResult<T extends TClassFindManySelectOrIncludeProp> =
	GetFindResult<Prisma.$ClassPayload, T & { where: Prisma.ClassWhereInput }>[];

export interface ICreateClassRequest {
	profileId: string;
	subject: string;
	cost: number;
	schedules?: TClassSchedule[];
}

export interface IFindBySubjectWeekDayAndTime {
	subject: string;
	weekDay: number;
	time: number;
}
