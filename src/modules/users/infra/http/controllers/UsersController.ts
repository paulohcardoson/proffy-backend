import { Request, Response } from "express";
import { container } from "tsyringe";

import CreateUserService from "@modules/users/services/CreateUserService";
import DeleteUserService from "@modules/users/services/DeleteUserService";

class UsersController {
	async create(req: Request, res: Response) {
		const createUserService = container.resolve(CreateUserService);

		const user = await createUserService.execute(req.body);

		return res.status(201).json({ id: user.id });
	}

	async delete(req: Request, res: Response) {
		const deleteUserService = container.resolve(DeleteUserService);

		await deleteUserService.execute({ id: req.userId, ...req.body });

		return res.status(200).json({ message: "User deleted successfully." });
	}
}

export default UsersController;
