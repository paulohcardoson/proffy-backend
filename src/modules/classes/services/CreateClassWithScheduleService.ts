import { inject, injectable } from "tsyringe";

import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";
import { IClassesRepository } from "../repositories/classes/IClassesRepository";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { IClassesSchedulesRepository } from "../repositories/classes-schedules/IClassesSchedulesRepository";
import checkIfPeriodsOfTimeCollapse from "@shared/utils/functions/checkIfPeriodsOfTimeCollapse";
import transformHoursAndMinutesStringToMinutes from "@shared/utils/functions/transformHoursAndMinutesStringToMinutes";
import AppError from "@shared/errors/AppError";
import { IClassSchedule } from "../repositories/classes-schedules/types";
import { IScheduleRequest } from "../types/IScheduleRequest";

interface IRequest {
	userId: string;
	subject: string;
	cost: number;
	schedule: IScheduleRequest[];
}

interface ICreateClassRequest {
	profileId: string;
	subject: string;
	cost: number;
}

interface ICreateClassScheduleRequest {
	classId: string;
	schedule: IScheduleRequest[];
}

@injectable()
class CreateClassWithScheculeService {
	constructor(
		@inject("ProfilesRepository")
		private profilesRepository: IProfilesRepository,

		@inject("ClassesRepository")
		private classesRepository: IClassesRepository,

		@inject("ClassesSchedulesRepository")
		private classesSchedulesRepository: IClassesSchedulesRepository,
	) {}

	async execute({ userId, subject, cost, schedule }: IRequest) {
		const profile = await this.profilesRepository.findByUserId(userId, {
			select: { id: true },
		});

		if (!profile) {
			throw new ProfileNotFoundError();
		}

		const isScheduleValid = this.checkIfScheduleIsValid(schedule);

		if (!isScheduleValid) throw new AppError("Invalid schedule.");

		const createdClass = await this.createClass({
			profileId: profile.id,
			subject,
			cost: Number(cost.toFixed(2)),
		});

		await this.createClassSchedule({
			classId: createdClass.id,
			schedule,
		});

		return createdClass;
	}

	async createClass({ profileId, subject, cost }: ICreateClassRequest) {
		const class_ = await this.classesRepository.save({
			profileId,
			subject,
			cost,
		});

		return class_;
	}

	async createClassSchedule({
		classId,
		schedule,
	}: ICreateClassScheduleRequest) {
		const schedulesFormatedToDatabaseSchema: IClassSchedule[] = schedule.map(
			(period) => ({
				from: transformHoursAndMinutesStringToMinutes(period.from),
				to: transformHoursAndMinutesStringToMinutes(period.to),
				weekDay: period.week_day,
			}),
		);

		await this.classesSchedulesRepository.createMany({
			classId,
			schedule: schedulesFormatedToDatabaseSchema,
		});
	}

	checkIfScheduleIsValid(schedule: IScheduleRequest[]) {
		const isScheduleValid = schedule.some((period, index) => {
			const scheduleAsNumbers = {
				from: transformHoursAndMinutesStringToMinutes(period.from),
				to: transformHoursAndMinutesStringToMinutes(period.to),
			};

			const scheduleToVerify = schedule.filter((_period, periodIndex) => {
				const hasAlreadyBeenVerified = index > periodIndex;

				if (hasAlreadyBeenVerified) return false;

				const isNotTheSameSchedule = _period !== period;
				const isOnTheSameDay = _period.week_day === period.week_day;

				return isNotTheSameSchedule && isOnTheSameDay;
			});

			const isScheduleInvalid = scheduleToVerify.some((periodToVerify) => {
				const scheduleToVerifyAsNumbers = {
					from: transformHoursAndMinutesStringToMinutes(periodToVerify.from),
					to: transformHoursAndMinutesStringToMinutes(periodToVerify.to),
				};

				const doesPeriodsCollapse = checkIfPeriodsOfTimeCollapse(
					scheduleAsNumbers,
					scheduleToVerifyAsNumbers,
				);

				return doesPeriodsCollapse;
			});

			return isScheduleInvalid;
		});

		return !isScheduleValid;
	}
}

export default CreateClassWithScheculeService;
