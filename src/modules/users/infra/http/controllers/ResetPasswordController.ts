import { Request, Response } from "express";
import { container } from "tsyringe";

import ResetPasswordService from "@modules/users/services/ResetPasswordService";

class ResetPasswordController {
	async create(req: Request, res: Response) {
		const resetPasswordController = container.resolve(ResetPasswordService);

		await resetPasswordController.execute(req.body);

		return res.status(204).json();
	}
}

export default ResetPasswordController;
