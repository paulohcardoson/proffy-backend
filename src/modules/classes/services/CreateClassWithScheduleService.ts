import { inject, injectable } from "tsyringe";

// Errors
import AppError from "@shared/errors/AppError";
import ProfileNotFoundError from "@shared/errors/app/ProfileNotFoundError";

// Types
import { IClassesRepository } from "@modules/classes/repositories/classes/IClassesRepository";
import { IProfilesRepository } from "@modules/profiles/repositories/profiles/IProfilesRepository";
import { IClassesSchedulesRepository } from "../repositories/classes-schedules/IClassesSchedulesRepository";
import { TSchedule } from "../types/TSchedule";
import { TScheduleRequest } from "../types/TScheduleRequest";
import { IPeriod } from "../types/IPeriod";

// Utils
import checkIfPeriodsOfTimeCollapse from "@shared/utils/functions/checkIfPeriodsOfTimeCollapse";
import transformHoursAndMinutesStringToMinutes from "@shared/utils/functions/transformHoursAndMinutesStringToMinutes";

interface IRequest {
	userId: string;
	subject: string;
	cost: number;
	schedule: TScheduleRequest;
}

interface ICreateClassRequest {
	profileId: string;
	subject: string;
	cost: number;
}

interface ICreateClassScheduleRequest {
	classId: string;
	schedule: TSchedule;
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

	async execute({
		userId,
		subject,
		cost,
		schedule: scheduleRequest,
	}: IRequest) {
		const profile = await this.profilesRepository.findByUserId(userId, {
			select: { id: true },
		});

		if (!profile) {
			throw new ProfileNotFoundError();
		}

		const schedule: TSchedule = scheduleRequest.map((period) => ({
			weekDay: period.week_day,
			from: transformHoursAndMinutesStringToMinutes(period.from),
			to: transformHoursAndMinutesStringToMinutes(period.to),
		}));

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

	private async createClass({ profileId, subject, cost }: ICreateClassRequest) {
		const class_ = await this.classesRepository.save({
			profileId,
			subject,
			cost,
		});

		return class_;
	}

	private async createClassSchedule({
		classId,
		schedule,
	}: ICreateClassScheduleRequest) {
		await this.classesSchedulesRepository.createMany({
			classId,
			schedule,
		});
	}

	private checkIfScheduleIsValid(schedule: TSchedule) {
		const isInvalid = schedule.some((period, index) => {
			const periodIsValid = this.checkIfPeriodIsValid(period);

			if (!periodIsValid) return true;

			const periodsToVerify = schedule.filter((_period, periodIndex) => {
				if (index >= periodIndex) return false;

				const isOnSameDay = period.weekDay === _period.weekDay;

				return isOnSameDay;
			});

			return periodsToVerify.some((_period) =>
				checkIfPeriodsOfTimeCollapse(period, _period),
			);
		});

		return !isInvalid;
	}

	private checkIfPeriodIsValid(period: IPeriod) {
		if (period.from >= period.to) return false;

		return true;
	}
}

export default CreateClassWithScheculeService;
