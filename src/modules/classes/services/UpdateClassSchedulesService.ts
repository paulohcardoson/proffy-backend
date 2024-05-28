import { inject, injectable } from "tsyringe";
import transformHoursAndMinutesStringToMinutes from "@shared/utils/functions/transformHoursAndMinutesStringToMinutes";

import AppError from "@shared/errors/AppError";
import ClassNotFoundError from "@shared/errors/app/ClassNotFoundError";

import { IClassSchedule } from "@modules/classes/repositories/classes-schedules/types";
import { IClassesSchedulesRepository } from "../repositories/classes-schedules/IClassesSchedulesRepository";
import { IClassesRepository } from "../repositories/classes/IClassesRepository";

interface IClassScheduleRequest {
	weekDay: number;
	from: string;
	to: string;
}

interface IRequest {
	classId: string;
	schedules: IClassScheduleRequest[];
}

interface IVerifyScheduleRequest {
	scheduleToVerify: {
		from: number;
		to: number;
	};
	unavailableTimes: {
		from: number;
		to: number;
	}[];
}

@injectable()
class UpdateClassSchedulesService {
	constructor(
		@inject("ClassesSchedulesRepository")
		private classesSchedulesRepository: IClassesSchedulesRepository,

		@inject("ClassesRepository")
		private classesRepository: IClassesRepository,
	) {}

	async execute({ classId, schedules }: IRequest) {
		const class_ = await this.classesRepository.findById(classId, {
			select: { id: true },
		});

		if (!class_) {
			throw new ClassNotFoundError();
		}

		if (!this.areAllSchedulesValid(schedules)) {
			throw new AppError("This schedule is impossible.");
		}

		await this.classesSchedulesRepository.deleteAllByClassId(classId);
		await this.classesSchedulesRepository.createMany({
			classId,
			schedules: schedules.map(this._transformScheduleTimeinMinutes),
		});
	}

	private _verifyIfScheduleIsAvailable({
		scheduleToVerify,
		unavailableTimes,
	}: IVerifyScheduleRequest) {
		const scheduleStartTime = scheduleToVerify.from;
		const scheduleEndTime = scheduleToVerify.to;

		const isValid = !unavailableTimes.some(
			({ from: startTime, to: endTime }) => {
				if (scheduleStartTime >= startTime && scheduleStartTime <= endTime)
					return true;

				if (scheduleEndTime >= startTime && scheduleEndTime <= endTime)
					return true;
			},
		);

		return isValid;
	}

	private _transformScheduleTimeinMinutes(
		schedule: IClassScheduleRequest,
	): IClassSchedule {
		return {
			weekDay: schedule.weekDay,
			from: transformHoursAndMinutesStringToMinutes(schedule.from),
			to: transformHoursAndMinutesStringToMinutes(schedule.to),
		};
	}

	private areAllSchedulesValid(schedules: IClassScheduleRequest[]) {
		const areValid = !schedules.some((schedule) => {
			const schedulesToVerify = schedules.filter((schedule_) => {
				const isTheSameSchedule = schedule_ === schedule;
				const isOnTheSameWeekDay = schedule_.weekDay === schedule.weekDay;

				return !isTheSameSchedule && isOnTheSameWeekDay;
			});

			const scheduleInMinutes = this._transformScheduleTimeinMinutes(schedule);
			const schedulesToVerifyInMinutes = schedulesToVerify.map(
				this._transformScheduleTimeinMinutes,
			);

			const scheduleIsAvailable = this._verifyIfScheduleIsAvailable({
				scheduleToVerify: scheduleInMinutes,
				unavailableTimes: schedulesToVerifyInMinutes,
			});

			const scheduleIsUnavailable = !scheduleIsAvailable;

			return scheduleIsUnavailable;
		});

		return areValid;
	}
}

export default UpdateClassSchedulesService;
