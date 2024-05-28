import { TPasswordRecoveryToken } from "./types";

export interface IPasswordRecoveryTokensRepository {
	generate: (userId: string) => Promise<TPasswordRecoveryToken>;
	findByToken: (token: string) => Promise<TPasswordRecoveryToken | null>;
}
