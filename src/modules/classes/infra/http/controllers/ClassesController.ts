import { Request, Response } from "express";
import { container } from "tsyringe";

import FindClassesService from "@modules/classes/services/FindClassesService";
import generateAvatarURL from "@shared/utils/functions/generateAvatarURL";

class ClassesController {
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

		const response = classes.map((c) => {
			c.profile.avatar = c.profile.avatar
				? generateAvatarURL(c.profile.avatar)
				: null;

			return c;
		});

		return res.json(response);
	}
}

export default ClassesController;
