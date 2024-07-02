import { Request, Response } from "express";
import { container } from "tsyringe";

import CreateUserService from "@modules/users/services/CreateUserService";
import DeleteUserService from "@modules/users/services/DeleteUserService";
import UpdateProfileInfoService from "@modules/profiles/services/UpdateProfileInfoService";

class UsersController {
	async create(req: Request, res: Response) {
		const { email, password } = req.body;

		const createUserService = container.resolve(CreateUserService);

		const user = await createUserService.execute({ email, password });

		return res.status(201).json({ id: user.id });
	}

	async createWithProfile(req: Request, res: Response) {
		const { email, password, name, bio, phone_number } = req.body;

		const createUserService = container.resolve(CreateUserService);
		const updateProfileInfoService = container.resolve(
			UpdateProfileInfoService,
		);

		const user = await createUserService.execute({ email, password });
		const profile = await updateProfileInfoService.execute({
			userId: user.id,
			name,
			bio,
			phoneNumber: phone_number,
		});

		return res.status(201).json(profile);
	}

	async delete(req: Request, res: Response) {
		const deleteUserService = container.resolve(DeleteUserService);

		await deleteUserService.execute({ id: req.userId, ...req.body });

		return res.status(200).json({ message: "User deleted successfully." });
	}
}

export default UsersController;
