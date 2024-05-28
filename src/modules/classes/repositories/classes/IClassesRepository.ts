import {
	ICreateClassRequest,
	IFindBySubjectWeekDayAndTime,
	TClass,
	TClassFindManyResult,
	TClassFindManySelectOrIncludeProp,
	TClassFindUniqueResult,
	TClassFindUniqueSelectOrIncludeProp,
} from "./types";

export interface IClassesRepository {
	save: (data: ICreateClassRequest) => Promise<TClass>;
	findBySubjectWeekDayAndTime: <T extends TClassFindManySelectOrIncludeProp>(
		data: IFindBySubjectWeekDayAndTime,
		args?: T,
	) => Promise<TClassFindManyResult<T>>;
	findById: <T extends TClassFindUniqueSelectOrIncludeProp>(
		id: string,
		args?: T,
	) => Promise<TClassFindUniqueResult<T> | null>;
}
