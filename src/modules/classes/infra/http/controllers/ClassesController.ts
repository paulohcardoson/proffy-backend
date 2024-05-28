import { Request, Response } from "express";
import { container } from "tsyringe";

import CreateClassService from "@modules/classes/services/CreateClassService";
import UpdateClassSchedulesService from "@modules/classes/services/UpdateClassSchedulesService";
import FindClassesService from "@modules/classes/services/FindClassesService";

interface ICreateRequestBody {
	subject: string;
	cost: number;
	schedules: {
		week_day: number;
		from: string;
		to: string;
	}[];
}

class ClassesController {
	async create(req: Request, res: Response) {
		const userId = req.userId as string;
		const { subject, cost, schedules } = req.body as ICreateRequestBody;

		const createClassService = container.resolve(CreateClassService);
		const updateClassSchedulesService = container.resolve(
			UpdateClassSchedulesService,
		);

		const class_ = await createClassService.execute({ userId, subject, cost });
		await updateClassSchedulesService.execute({
			classId: class_.id,
			schedules: schedules.map(({ week_day: weekDay, from, to }) => ({
				weekDay,
				from,
				to,
			})),
		});

		return res.json(class_);
	}

	async index(req: Request, res: Response) {
		const weekDay = Number(req.query.week_day);
		const subject = req.query.subject as string;
		const time = req.query.time as string;

		const findClassesService = container.resolve(FindClassesService);
		const classes = await findClassesService.execute({
			weekDay,
			subject,
			time,
		});

		return res.json(classes);
	}
}

export default ClassesController;
