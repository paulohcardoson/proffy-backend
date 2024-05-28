/* eslint-disable indent */
import { IPasswordRecoveryTokensRepository } from "@modules/users/repositories/password-recovery-tokens/IPasswordRecoveryTokensRepository";
import prisma from "@shared/containers/prisma";
import { randomUUID } from "crypto";

class PasswordRecoveryTokensRepository
	implements IPasswordRecoveryTokensRepository
{
	private repository = prisma.passwordRecoveryToken;

	async generate(userId: string) {
		const token = randomUUID();

		return await this.repository.upsert({
			create: {
				token,
				userId,
			},
			update: { token },
			where: { userId },
		});
	}

	async findByToken(token: string) {
		const passwordRecoveryToken = this.repository.findUnique({
			where: { token },
		});

		return passwordRecoveryToken;
	}
}

export default PasswordRecoveryTokensRepository;
