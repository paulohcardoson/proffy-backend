import { Request, Response } from "express";
import { container } from "tsyringe";

import UpdatePasswordService from "@modules/users/services/UpdatePasswordService";

class UpdatePasswordController {
	async create(req: Request, res: Response) {
		const userId = req.userId as string;
		const updatePasswordService = container.resolve(UpdatePasswordService);

		await updatePasswordService.execute({ userId, ...req.body });

		return res.json({
			message: "Password changed successfully.",
		});
	}
}

export default UpdatePasswordController;
