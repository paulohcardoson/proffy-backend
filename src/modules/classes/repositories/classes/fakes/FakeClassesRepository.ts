import { Prisma } from "@prisma/client";
import {
	ICreateClassRequest,
	IFindBySubjectWeekDayAndTime,
	TClass,
	TClassFindManyResult,
	TClassFindManySelectOrIncludeProp,
	TClassFindUniqueResult,
} from "../types";
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";
import { randomUUID } from "crypto";

class FakeClassesRepository implements IClassesRepository {
	constructor(private repository: TClass[] = []) {}

	async save(data: ICreateClassRequest) {
		const _class: TClass = {
			...data,
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.repository.push(_class);

		return _class;
	}

	async findBySubjectWeekDayAndTime<
		T extends TClassFindManySelectOrIncludeProp,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	>(data: IFindBySubjectWeekDayAndTime, args?: T) {
		return this.repository.filter((_class) => {
			const hasSameSubject = _class.subject === data.subject;

			// Cannot verify the rest

			return hasSameSubject;
		}) as TClassFindManyResult<T>;
	}

	async findById<T extends Omit<Prisma.ClassFindUniqueArgs, "where">>(
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		args?: T,
	) {
		return this.repository.find(
			(_class) => _class.id === id,
		) as TClassFindUniqueResult<T>;
	}
}

export default FakeClassesRepository;
