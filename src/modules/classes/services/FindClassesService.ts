import { inject, injectable } from "tsyringe";

import { IClassesRepository } from "../repositories/classes/IClassesRepository";

import transformHoursAndMinutesStringToMinutes from "@shared/utils/functions/transformHoursAndMinutesStringToMinutes";

interface IRequest {
	weekDay: number;
	subject: string;
	time: string;
}

@injectable()
class FindClassesService {
	constructor(
		@inject("ClassesRepository")
		private classesRepository: IClassesRepository,
	) {}

	async execute({ weekDay, subject, time }: IRequest) {
		const timeInMinutes = transformHoursAndMinutesStringToMinutes(time);

		const classes = await this.classesRepository.findBySubjectWeekDayAndTime(
			{
				subject,
				weekDay,
				time: timeInMinutes,
			},
			{ include: { profile: true, classSchedule: true } },
		);

		return classes;
	}
}

export default FindClassesService;
