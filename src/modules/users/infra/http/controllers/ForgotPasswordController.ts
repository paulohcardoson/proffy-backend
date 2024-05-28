import { Request, Response } from "express";
import { container } from "tsyringe";

import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";

class ForgotPasswordController {
	async create(req: Request, res: Response) {
		const sendForgotPasswordEmailService = container.resolve(
			SendForgotPasswordEmailService,
		);

		await sendForgotPasswordEmailService.execute(req.body);

		return res.status(204).json();
	}
}

export default ForgotPasswordController;
