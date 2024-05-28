import fs from "fs/promises";
import path from "path";
import { inject, injectable } from "tsyringe";

import { IPasswordRecoveryTokensRepository } from "@modules/users/repositories/password-recovery-tokens/IPasswordRecoveryTokensRepository";
import { IUsersRepository } from "@modules/users/repositories/users/IUsersRepository";
import AppError from "@shared/errors/AppError";
import { IMailProvider } from "@shared/containers/providers/MailProvider/model/IMailProvider";
import { APP_WEB_URL } from "@shared/env";

interface IRequest {
	email: string;
}

@injectable()
class SendForgotPasswordEmailService {
	constructor(
		@inject("UsersRepository")
		private usersRepository: IUsersRepository,

		@inject("PasswordRecoveryTokensRepository")
		private passwordRecoveryTokensRepository: IPasswordRecoveryTokensRepository,

		@inject("MailProvider")
		private mailProvider: IMailProvider,
	) {}

	async execute(data: IRequest) {
		const user = await this.usersRepository.findByEmail(data.email, {
			select: { id: true },
		});

		if (!user) {
			throw new AppError("This email isn't associated to any account.");
		}

		const passwordRecoveryToken =
			await this.passwordRecoveryTokensRepository.generate(user.id);

		const forgotPasswordTemplateFile = await fs.readFile(
			path.resolve(__dirname, "..", "views", "forgot_password.handlebars"),
		);

		await this.mailProvider.sendMail({
			to: {
				name: "",
				email: data.email,
			},
			subject: "[Proffy] Recuperação de senha.",
			templateData: {
				template: forgotPasswordTemplateFile.toString(),
				variables: {
					host: APP_WEB_URL,
					link: `${APP_WEB_URL}/reset-password?token=${passwordRecoveryToken.token}`,
					email: data.email,
					primary_color: "#8257e5",
				},
			},
		});
	}
}

export default SendForgotPasswordEmailService;
