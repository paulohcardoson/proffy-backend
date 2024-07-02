import { Request, Response } from "express";
import { container } from "tsyringe";

import CreateClassWithScheculeService from "@modules/classes/services/CreateClassWithScheduleService";
import { TScheduleRequest } from "@modules/classes/types/TScheduleRequest";

interface ICreateRequestBody {
	subject: string;
	cost: number;
	schedule: TScheduleRequest;
}

class ClassesWithScheduleController {
	async create(req: Request, res: Response) {
		const userId = req.userId as string;
		const { subject, cost, schedule } = req.body as ICreateRequestBody;

		const createClassWithScheculeService = container.resolve(
			CreateClassWithScheculeService,
		);

		const class_ = await createClassWithScheculeService.execute({
			userId,
			subject,
			cost,
			schedule,
		});

		return res.json(class_);
	}
}

export default ClassesWithScheduleController;
