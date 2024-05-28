import { Request, Response } from "express";
import { container } from "tsyringe";

import CreateSessionService from "@modules/users/services/CreateSessionService";

class SessionsController {
	async create(req: Request, res: Response) {
		const createSessionService = container.resolve(CreateSessionService);

		const token = await createSessionService.execute(req.body);

		return res.status(200).json({ token });
	}
}

export default SessionsController;
