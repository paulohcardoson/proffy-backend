import { randomUUID } from "crypto";
import { IPasswordRecoveryTokensRepository } from "../IPasswordRecoveryTokensRepository";
import { TPasswordRecoveryToken } from "../types";

// prettier-ignore
class FakePasswordRecoveryTokensRepository implements IPasswordRecoveryTokensRepository {
	private repository: TPasswordRecoveryToken[] = [];

	async generate(userId: string) {
		const token: TPasswordRecoveryToken = {
			id: randomUUID(),
			token: randomUUID(),
			userId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		this.repository.push(token);

		return token;
	}

	async findByToken(tokenToFind: string) {
		const foundToken = this.repository.find(({token}) => token === tokenToFind);

		return foundToken || null;
	}
}

export default FakePasswordRecoveryTokensRepository;
