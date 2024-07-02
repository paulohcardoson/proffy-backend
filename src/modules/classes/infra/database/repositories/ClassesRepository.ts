import prisma from "@shared/containers/prisma";
import { Prisma } from "@prisma/client";
import {
	ICreateClassRequest,
	IFindBySubjectWeekDayAndTime,
	TClassFindManySelectOrIncludeProp,
} from "@modules/classes/repositories/classes/types";
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";

class ClassesRepository implements IClassesRepository {
	private repository = prisma.class;

	async save(data: ICreateClassRequest) {
		return await this.repository.create({ data });
	}

	async findBySubjectWeekDayAndTime<
		T extends TClassFindManySelectOrIncludeProp,
	>({ subject, weekDay, time }: IFindBySubjectWeekDayAndTime, args?: T) {
		return await this.repository.findMany({
			where: {
				subject,
				classSchedule: {
					some: {
						weekDay,
						from: { lte: time },
						to: { gte: time },
					},
				},
			},
			...args,
		} as Prisma.SelectSubset<
			T & { where: Prisma.ClassWhereInput },
			Prisma.ClassFindManyArgs
		>);
	}

	async findById<T extends Omit<Prisma.ClassFindUniqueArgs, "where">>(
		id: string,
		args?: T,
	) {
		return await this.repository.findUnique({
			where: { id },
			...args,
		} as Prisma.SelectSubset<
			T & { where: Prisma.ClassWhereUniqueInput },
			Prisma.ClassFindUniqueArgs
		>);
	}
}

export default ClassesRepository;
