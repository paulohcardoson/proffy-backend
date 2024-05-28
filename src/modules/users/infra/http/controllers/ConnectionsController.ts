import { Request, Response } from "express";
import { container } from "tsyringe";

import CountConnectionsService from "@modules/users/services/CountConnectionsService";
import CreateConnectionService from "@modules/users/services/CreateConnectionService";

class ConnectionsController {
	async create(req: Request, res: Response) {
		const profileId = req.body.profile_id as string;

		const createConnectionService = container.resolve(CreateConnectionService);
		const connection = await createConnectionService.execute({ profileId });

		return res.json(connection);
	}

	async index(req: Request, res: Response) {
		const countConnectionsService = container.resolve(CountConnectionsService);
		const connectionsCount = await countConnectionsService.execute();

		return res.json(connectionsCount);
	}
}

export default ConnectionsController;
