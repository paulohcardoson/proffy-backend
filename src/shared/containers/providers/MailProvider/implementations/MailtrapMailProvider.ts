import { inject, injectable } from "tsyringe";
import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { IMailProvider } from "../model/IMailProvider";
import { ISendMailDTO } from "../dtos/ISendMailDTO";
import { IMailTemplateProvider } from "@shared/containers/providers/MailTemplateProvider/models/IMailTemplateProvider";
import { MAILTRAP_PASSWORD, MAILTRAP_USER } from "@shared/env";

@injectable()
class MailtrapMailProvider implements IMailProvider {
	transporter: Transporter<SMTPTransport.SentMessageInfo>;

	constructor(
		@inject("MailTemplateProvider")
		private mailTemplateProvider: IMailTemplateProvider,
	) {
		this.transporter = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			secure: false,
			auth: {
				user: MAILTRAP_USER,
				pass: MAILTRAP_PASSWORD,
			},
		});
	}

	async sendMail({ to, from, subject, templateData }: ISendMailDTO) {
		const info = await this.transporter.sendMail({
			to: {
				name: to.name,
				address: to.email,
			},
			from: {
				name: from?.name || "Equipe Proffy",
				address: from?.email || "equipe@proffy.com.br",
			},
			subject,
			html: await this.mailTemplateProvider.parse(templateData),
		});

		console.log(`Message sent: ${info.messageId}`);
	}
}

export default MailtrapMailProvider;
